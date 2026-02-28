import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceType: { type: String, required: true },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    submittedPayload: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, default: "pending" },
    escalated: { type: Boolean, default: false },
    complaintRef: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
