import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceType: { type: String, required: true, index: true },
    accountId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

billSchema.index({ userId: 1, serviceType: 1, accountId: 1 }, { unique: true });

export const Bill = mongoose.model("Bill", billSchema);
