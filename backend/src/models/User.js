import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    aadhaarLast4: { type: String, default: "" },
    aadhaarNumber: { type: String, default: "" },
    preferredLanguage: { type: String, default: "en" },
    profileId: { type: String, default: "", index: true },
    fullName: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
