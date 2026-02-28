import Stripe from "stripe";
import { config } from "./config.js";

export const getStripeClient = () => {
  if (!config.stripeSecretKey) {
    throw new Error("Stripe is not configured");
  }
  return new Stripe(config.stripeSecretKey);
};

