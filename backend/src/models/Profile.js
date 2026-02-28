import mongoose from "mongoose";

const pendingBillSchema = new mongoose.Schema(
  {
    billRef: { type: String, required: true },
    serviceType: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAtLabel: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { _id: false }
);

const reminderSchema = new mongoose.Schema(
  {
    reminderId: { type: String, required: true },
    title: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, default: "upcoming" },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    receiptMode: { type: String, required: true },
    smsAlerts: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    pushAlerts: { type: Boolean, default: true },
    kioskAccessibilityMode: { type: Boolean, default: false },
    highContrastMode: { type: Boolean, default: false },
    largeTextMode: { type: Boolean, default: false },
    biometricLock: { type: Boolean, default: false },
    autoLogoutMinutes: { type: Number, default: 3 },
    defaultService: { type: String, default: "electricity" },
    startPage: { type: String, default: "services" },
    paperlessReceipts: { type: Boolean, default: true },
  },
  { _id: false }
);

const helpItemSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    details: { type: String, required: true },
    contact: { type: String, required: true },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    profileId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    ward: { type: String, required: true },
    aadhaarMasked: { type: String, required: true },
    pendingBills: { type: [pendingBillSchema], default: [] },
    notifications: { type: [notificationSchema], default: [] },
    reminders: { type: [reminderSchema], default: [] },
    settings: { type: settingsSchema, required: true },
    help: { type: [helpItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
