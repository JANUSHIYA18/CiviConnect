import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceType: { type: String, required: true },
    accountId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "completed" },
    billPeriod: { type: String, default: "" },
    receiptMode: { type: String, enum: ["digital", "print", "both"], default: "both" },
    transactionRef: { type: String, required: true, unique: true, index: true },
    stripeSessionId: { type: String, unique: true, sparse: true, index: true },
    stripePaymentIntentId: { type: String, default: "", index: true },
    submittedPayload: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
