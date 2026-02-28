import { config } from "./config.js";
import { finalizeCheckoutSession } from "./paymentService.js";
import { getStripeClient } from "./stripeService.js";

export const handleStripeWebhook = async (req, res, next) => {
  try {
    if (!config.stripeWebhookSecret) {
      return res.status(400).json({ message: "Stripe webhook is not configured" });
    }

    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ message: "Missing Stripe signature" });
    }

    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(req.body, signature, config.stripeWebhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await finalizeCheckoutSession(session);
    }

    return res.json({ received: true });
  } catch (error) {
    return next(error);
  }
};

