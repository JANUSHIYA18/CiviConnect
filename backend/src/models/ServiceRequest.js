import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    requestType: { type: String, required: true },
    serviceCategory: { type: String, required: true },
    fullName: { type: String, required: true },
    description: { type: String, required: true },
    documents: [{ type: String }],
    submittedPayload: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, default: "pending" },
    requestRef: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
