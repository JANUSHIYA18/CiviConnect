import express from "express";
import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";
import { config } from "./config.js";
import { authRequired } from "./middleware/auth.js";
import { upload } from "./middleware/upload.js";
import { OtpCode } from "./models/OtpCode.js";
import { User } from "./models/User.js";
import { Bill } from "./models/Bill.js";
import { Transaction } from "./models/Transaction.js";
import { Complaint } from "./models/Complaint.js";
import { ServiceRequest } from "./models/ServiceRequest.js";
import { Profile } from "./models/Profile.js";
import { ReceiptDownload } from "./models/ReceiptDownload.js";
import { sendOtpSms } from "./sms.js";
import { formatBillPeriod, formatDueDate, generateOtp, generateRef } from "./utils.js";
import { getStripeClient } from "./stripeService.js";
import { finalizeCheckoutSession } from "./paymentService.js";
import { buildReceiptPdf } from "./receiptPdf.js";

export const router = express.Router();

const serviceDefaults = {
  electricity: 2450,
  gas: 890,
  water: 560,
  waste: 350,
  property: 12500,
  certificates: 150,
};

const normalizePhone = (value = "") => value.replace(/\D/g, "");
const toIndianE164 = (phoneDigits = "") => {
  if (phoneDigits.length === 10) return `+91${phoneDigits}`;
  if (phoneDigits.length === 12 && phoneDigits.startsWith("91")) return `+${phoneDigits}`;
  return "";
};

const aadhaarIdentityPhone = (aadhaar) => {
  const digest = createHash("sha256").update(aadhaar).digest("hex").slice(0, 24);
  return `aadhaar-${digest}`;
};
const profileIdSort = { profileId: 1 };

const resolveUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  if (user.profileId) {
    const byStoredId = await Profile.findOne({ profileId: user.profileId });
    if (byStoredId) return { user, profile: byStoredId };
  }

  const phoneDigits = String(user.phone || "").replace(/\D/g, "");
  const candidatePhone = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : "";

  let profile = null;
  if (candidatePhone) {
    profile = await Profile.findOne({ phone: candidatePhone });
  }

  if (!profile && user.aadhaarLast4) {
    profile = await Profile.findOne({ aadhaarMasked: { $regex: `${user.aadhaarLast4}$` } });
  }

  if (!profile) {
    const allProfiles = await Profile.find({}, "profileId").sort(profileIdSort).lean();
    if (!allProfiles.length) return null;
    const seedNumber = Number.parseInt(String(user._id).slice(-6), 16);
    const index = Number.isFinite(seedNumber) ? seedNumber % allProfiles.length : 0;
    profile = await Profile.findOne({ profileId: allProfiles[index].profileId });
  }

  if (!profile) return null;

  user.profileId = profile.profileId;
  if (!user.fullName) user.fullName = profile.fullName;
  await user.save();
  return { user, profile };
};

const buildReceiptPayload = (txn, profile) => ({
  transactionRef: txn.transactionRef,
  serviceType: txn.serviceType,
  accountId: txn.accountId,
  amount: txn.amount,
  status: txn.status,
  billPeriod: txn.billPeriod,
  receiptMode: txn.receiptMode,
  transactionDateTime: new Date(txn.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
  fullName: profile?.fullName || "Resident",
  phone: profile?.phone || "",
  email: profile?.email || "",
  address: profile?.address || "",
  ward: profile?.ward || "",
  aadhaarMasked: profile?.aadhaarMasked || "",
});

const createAuthResponse = async ({ phone, aadhaar }) => {
  const aadhaarLast4 = aadhaar.length === 12 ? aadhaar.slice(-4) : "";
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone, aadhaarLast4 });
  } else if (aadhaarLast4 && user.aadhaarLast4 !== aadhaarLast4) {
    user.aadhaarLast4 = aadhaarLast4;
  }

  if (aadhaar.length === 12 && user.aadhaarNumber !== aadhaar) {
    user.aadhaarNumber = aadhaar;
  }

  if (user.isModified()) {
    await user.save();
  }

  const resolved = await resolveUserProfile(user._id.toString());

  const token = jwt.sign(
    { userId: user._id.toString(), phone: user.phone },
    config.jwtSecret,
    { expiresIn: "8h" }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      phone: user.phone,
      aadhaarLinked: Boolean(user.aadhaarLast4),
      profileId: resolved?.profile?.profileId || user.profileId || "",
      fullName: resolved?.profile?.fullName || user.fullName || "",
    },
  };
};

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.post("/auth/send-otp", async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const phoneE164 = toIndianE164(phone);
  if (!phoneE164) {
    return res.status(400).json({ message: "Valid phone is required" });
  }

  const code = generateOtp();
  await OtpCode.create({
    phone,
    code,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const smsResult = await sendOtpSms({ phoneE164, code });
  if (!smsResult.sent && config.nodeEnv === "production") {
    return res.status(502).json({ message: "Failed to send OTP SMS" });
  }

  return res.json({
    message: "OTP sent",
    ...(config.nodeEnv !== "production" && !smsResult.sent ? { debugOtp: code } : {}),
    ...(config.nodeEnv !== "production" ? { sms: smsResult } : {}),
  });
});

router.post("/auth/verify-otp", async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const otp = String(req.body?.otp || "").trim();
  const aadhaar = String(req.body?.aadhaar || "").replace(/\D/g, "");
  const phoneE164 = toIndianE164(phone);

  if (!phoneE164 || otp.length !== 6) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  const otpDoc = await OtpCode.findOne({
    phone,
    code: otp,
    consumed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpDoc) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  otpDoc.consumed = true;
  await otpDoc.save();
  return res.json(await createAuthResponse({ phone, aadhaar }));
});

router.post("/auth/verify-aadhaar", async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const aadhaar = String(req.body?.aadhaar || "").replace(/\D/g, "");
  const phoneE164 = toIndianE164(phone);

  if (aadhaar.length !== 12) {
    return res.status(400).json({ message: "Valid Aadhaar is required" });
  }

  const authPhone = phoneE164 ? phone : aadhaarIdentityPhone(aadhaar);
  return res.json(await createAuthResponse({ phone: authPhone, aadhaar }));
});

router.post("/bills/lookup", authRequired, async (req, res) => {
  const serviceType = String(req.body?.serviceType || "electricity");
  const accountId = String(req.body?.accountId || "").trim();
  if (!accountId) {
    return res.status(400).json({ message: "accountId is required" });
  }

  let bill = await Bill.findOne({
    userId: req.user.userId,
    serviceType,
    accountId,
  });

  if (!bill) {
    bill = await Bill.create({
      userId: req.user.userId,
      serviceType,
      accountId,
      amount: serviceDefaults[serviceType] || 500,
      dueDate: formatDueDate(),
      period: formatBillPeriod(),
      status: "pending",
    });
  }

  return res.json({
    bill: {
      id: bill._id.toString(),
      serviceType: bill.serviceType,
      accountId: bill.accountId,
      amount: bill.amount,
      dueDate: bill.dueDate,
      period: bill.period,
      status: bill.status,
    },
  });
});

router.post("/payments/checkout-session", authRequired, async (req, res) => {
  const { serviceType, accountId, amount, billPeriod, receiptMode } = req.body || {};
  if (!serviceType || !accountId || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const stripe = getStripeClient();
  const requestOrigin = String(req.headers.origin || "");
  const isLocalDevOrigin = /^http:\/\/localhost:\d+$/.test(requestOrigin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(requestOrigin);
  const checkoutOrigin = requestOrigin === config.clientOrigin || isLocalDevOrigin ? requestOrigin : config.clientOrigin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          unit_amount: Math.round(numericAmount * 100),
          product_data: {
            name: `${serviceType} bill payment`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${checkoutOrigin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${checkoutOrigin}/payment/${encodeURIComponent(serviceType)}?review=1&accountId=${encodeURIComponent(accountId)}`,
    metadata: {
      userId: req.user.userId,
      serviceType,
      accountId,
      billPeriod: billPeriod || "",
      receiptMode: receiptMode || "both",
    },
  });

  return res.json({
    sessionId: session.id,
    sessionUrl: session.url,
  });
});

router.post("/payments/demo-complete", authRequired, async (req, res) => {
  const { serviceType, accountId, amount, billPeriod, receiptMode } = req.body || {};
  if (!serviceType || !accountId || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const transaction = await Transaction.create({
    userId: req.user.userId,
    serviceType,
    accountId,
    amount: numericAmount,
    billPeriod: billPeriod || "",
    receiptMode: receiptMode || "both",
    transactionRef: generateRef("TXN"),
    status: "completed",
    submittedPayload: req.body || {},
  });

  await Bill.updateOne({ userId: req.user.userId, serviceType, accountId }, { status: "paid" });

  return res.json({
    transactionRef: transaction.transactionRef,
    amount: transaction.amount,
    status: transaction.status,
  });
});

router.get("/payments/session/:sessionId", authRequired, async (req, res) => {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
    expand: ["payment_intent"],
  });

  const metadata = session.metadata || {};
  if (metadata.userId !== req.user.userId) {
    return res.status(403).json({ message: "Access denied for this payment session" });
  }

  let transaction = await Transaction.findOne({ stripeSessionId: session.id });
  if (!transaction && session.payment_status === "paid") {
    transaction = await finalizeCheckoutSession(session);
  }

  return res.json({
    sessionId: session.id,
    status: session.status,
    paymentStatus: session.payment_status,
    transactionRef: transaction?.transactionRef || null,
    amount: Number(session.amount_total || 0) / 100,
  });
});

router.post("/complaints", authRequired, async (req, res) => {
  const { serviceType, category, subject, description } = req.body || {};
  if (!category || !subject || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const complaint = await Complaint.create({
    userId: req.user.userId,
    serviceType: serviceType || "municipal",
    category,
    subject,
    description,
    submittedPayload: req.body || {},
    complaintRef: generateRef("CMP"),
  });

  return res.json({
    complaintRef: complaint.complaintRef,
    status: complaint.status,
  });
});

router.patch("/complaints/:ref/escalate", authRequired, async (req, res) => {
  const complaint = await Complaint.findOne({
    userId: req.user.userId,
    complaintRef: req.params.ref.toUpperCase(),
  });
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  complaint.escalated = true;
  complaint.status = "in_progress";
  await complaint.save();
  return res.json({ message: "Complaint escalated", status: complaint.status });
});

router.post("/service-requests", authRequired, upload.array("documents", 3), async (req, res) => {
  const { requestType, serviceCategory, fullName, description } = req.body || {};
  if (!requestType || !serviceCategory || !fullName || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const docs = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const request = await ServiceRequest.create({
    userId: req.user.userId,
    requestType,
    serviceCategory,
    fullName,
    description,
    documents: docs,
    submittedPayload: req.body || {},
    requestRef: generateRef("SR"),
  });

  return res.json({
    requestRef: request.requestRef,
    status: request.status,
    documents: request.documents,
  });
});

router.get("/tracking/:ref", authRequired, async (req, res) => {
  const ref = req.params.ref.toUpperCase().trim();
  let type = "";
  let record = null;

  if (ref.startsWith("CMP-")) {
    type = "Complaint";
    record = await Complaint.findOne({ userId: req.user.userId, complaintRef: ref });
  } else if (ref.startsWith("SR-")) {
    type = "Service Request";
    record = await ServiceRequest.findOne({ userId: req.user.userId, requestRef: ref });
  } else if (ref.startsWith("TXN-")) {
    type = "Transaction";
    record = await Transaction.findOne({ userId: req.user.userId, transactionRef: ref });
  }

  if (!record) {
    return res.status(404).json({ message: "No records found" });
  }

  const status = record.status || "pending";
  const description =
    type === "Transaction"
      ? `${record.serviceType} bill payment`
      : type === "Complaint"
      ? record.subject
      : record.description;

  return res.json({
    ref,
    type,
    status,
    date: new Date(record.updatedAt || record.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    description,
    escalated: Boolean(record.escalated),
  });
});

router.get("/me/profile", authRequired, async (req, res) => {
  const resolved = await resolveUserProfile(req.user.userId);
  if (!resolved?.profile) return res.status(404).json({ message: "Profile not found" });
  const profile = resolved.profile.toObject ? resolved.profile.toObject() : resolved.profile;

  return res.json({
    profile: {
      profileId: profile.profileId,
      fullName: profile.fullName,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      ward: profile.ward,
      aadhaarMasked: profile.aadhaarMasked,
      reminders: profile.reminders || [],
      updatedAt: profile.updatedAt,
    },
  });
});

router.get("/me/pending-bills", authRequired, async (req, res) => {
  const resolved = await resolveUserProfile(req.user.userId);
  if (!resolved?.profile) return res.status(404).json({ message: "Profile not found" });

  return res.json({
    pendingBills: resolved.profile.pendingBills || [],
  });
});

router.get("/me/notifications", authRequired, async (req, res) => {
  const resolved = await resolveUserProfile(req.user.userId);
  if (!resolved?.profile) return res.status(404).json({ message: "Profile not found" });

  return res.json({
    notifications: resolved.profile.notifications || [],
  });
});

router.get("/me/reminders", authRequired, async (req, res) => {
  const resolved = await resolveUserProfile(req.user.userId);
  if (!resolved?.profile) return res.status(404).json({ message: "Profile not found" });

  return res.json({
    reminders: resolved.profile.reminders || [],
  });
});

router.get("/me/settings", authRequired, async (req, res) => {
  const resolved = await resolveUserProfile(req.user.userId);
  if (!resolved?.profile) return res.status(404).json({ message: "Profile not found" });

  return res.json({
    settings: resolved.profile.settings || null,
  });
});

router.get("/me/help", authRequired, async (req, res) => {
  const resolved = await resolveUserProfile(req.user.userId);
  if (!resolved?.profile) return res.status(404).json({ message: "Profile not found" });

  return res.json({
    help: resolved.profile.help || [],
  });
});

router.get("/me/downloads", authRequired, async (req, res) => {
  const records = await ReceiptDownload.find({ userId: req.user.userId })
    .sort({ downloadedAt: -1 })
    .limit(200)
    .lean();

  return res.json({
    downloads: records.map((item) => ({
      transactionRef: item.transactionRef,
      fileName: item.fileName,
      serviceType: item.serviceType,
      amount: item.amount,
      downloadedAt: item.downloadedAt,
    })),
  });
});

router.get("/receipts/:ref", authRequired, async (req, res) => {
  const ref = req.params.ref.toUpperCase().trim();
  const txn = await Transaction.findOne({ userId: req.user.userId, transactionRef: ref });
  if (!txn) return res.status(404).json({ message: "Receipt not found" });
  const resolved = await resolveUserProfile(req.user.userId);
  const receipt = buildReceiptPayload(txn, resolved?.profile || null);

  return res.json(receipt);
});

router.get("/receipts/:ref/download", authRequired, async (req, res) => {
  const ref = req.params.ref.toUpperCase().trim();
  const txn = await Transaction.findOne({ userId: req.user.userId, transactionRef: ref });
  if (!txn) return res.status(404).json({ message: "Receipt not found" });

  const resolved = await resolveUserProfile(req.user.userId);
  const receipt = buildReceiptPayload(txn, resolved?.profile || null);
  const fileName = `receipt-${receipt.transactionRef}.pdf`;
  const pdf = buildReceiptPdf(receipt);

  await ReceiptDownload.create({
    userId: req.user.userId,
    transactionRef: receipt.transactionRef,
    fileName,
    serviceType: receipt.serviceType,
    amount: receipt.amount,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  return res.send(pdf);
});
