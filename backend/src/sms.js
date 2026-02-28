import { config } from "./config.js";

let twilioClient = null;
let twilioLoadFailed = false;

const canUseTwilio = () =>
  Boolean(config.twilioAccountSid && config.twilioAuthToken && config.twilioFromPhone);

const getTwilioClient = async () => {
  if (twilioClient || twilioLoadFailed) return twilioClient;

  try {
    const module = await import("twilio");
    const twilio = module.default || module;
    twilioClient = twilio(config.twilioAccountSid, config.twilioAuthToken);
    return twilioClient;
  } catch (_error) {
    twilioLoadFailed = true;
    return null;
  }
};

export const sendOtpSms = async ({ phoneE164, code }) => {
  if (!canUseTwilio()) {
    return { sent: false, reason: "Twilio config missing" };
  }

  const client = await getTwilioClient();
  if (!client) {
    return { sent: false, reason: "Twilio SDK missing" };
  }

  await client.messages.create({
    body: `${code} is your OTP for CiviConnect login. It is valid for 5 minutes.`,
    from: config.twilioFromPhone,
    to: phoneE164,
  });

  return { sent: true };
};

