import { Bill } from "./models/Bill.js";
import { Transaction } from "./models/Transaction.js";
import { generateRef } from "./utils.js";

const normalizeReceiptMode = (value) => {
  if (value === "digital" || value === "print" || value === "both") return value;
  return "both";
};

export const finalizeCheckoutSession = async (session) => {
  if (!session?.id) {
    throw new Error("Invalid checkout session");
  }

  const existing = await Transaction.findOne({ stripeSessionId: session.id });
  if (existing) return existing;

  const metadata = session.metadata || {};
  const { userId, serviceType, accountId, billPeriod = "", receiptMode = "both" } = metadata;
  if (!userId || !serviceType || !accountId) {
    throw new Error("Missing payment metadata");
  }

  const amountFromStripe = Number(session.amount_total || 0) / 100;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || "";

  const transaction = await Transaction.create({
    userId,
    serviceType,
    accountId,
    amount: amountFromStripe,
    billPeriod,
    receiptMode: normalizeReceiptMode(receiptMode),
    transactionRef: generateRef("TXN"),
    status: "completed",
    stripeSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    submittedPayload: {
      metadata,
      stripe: {
        sessionId: session.id,
        paymentIntentId,
        amountTotal: session.amount_total || 0,
        currency: session.currency || "inr",
      },
    },
  });

  await Bill.updateOne({ userId, serviceType, accountId }, { status: "paid" });
  return transaction;
};
