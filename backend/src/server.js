import cors from "cors";
import express from "express";
import path from "node:path";
import { config } from "./config.js";
import { connectDb } from "./db.js";
import { router } from "./routes.js";
import { handleStripeWebhook } from "./stripeWebhook.js";
import { ensureResidentProfiles } from "./seedResidentProfiles.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.nodeEnv !== "production") return callback(null, true);
      const isConfiguredOrigin = origin === config.clientOrigin;
      const isLocalDevOrigin = /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
      if (isConfiguredOrigin || isLocalDevOrigin) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false,
  })
);
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);
app.use(express.json());
app.use("/uploads", express.static(path.resolve("backend/uploads")));
app.use("/api", router);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const start = async () => {
  await connectDb();
  await ensureResidentProfiles();
  app.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
