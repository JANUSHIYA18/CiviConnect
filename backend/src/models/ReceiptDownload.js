import mongoose from "mongoose";

const receiptDownloadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    transactionRef: { type: String, required: true, index: true },
    fileName: { type: String, required: true },
    serviceType: { type: String, required: true },
    amount: { type: Number, required: true },
    downloadedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const ReceiptDownload = mongoose.model("ReceiptDownload", receiptDownloadSchema);
