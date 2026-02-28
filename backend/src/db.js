import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDb = async () => {
  if (!config.mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }
  await mongoose.connect(config.mongoUri);
};
