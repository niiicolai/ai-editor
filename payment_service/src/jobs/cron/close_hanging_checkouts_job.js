import CheckoutModel from "../../mongodb/models/checkout_model.js";
import JobModel from "../../mongodb/models/job_model.js";
import Stripe from "stripe";
import CheckoutService from "../../services/checkout_service.js";
import { CronJob } from "cron";

const API_KEY = process.env.STRIPE_API_KEY;
if (!API_KEY) console.error("STRIPE_API_KEY not set in .env");

const stripe = new Stripe(API_KEY);

const cronTime = "*/5 * * * *"; // Run every 5 minutes
const timeZone = "Europe/Copenhagen";
const limit = 100;

const onTick = async () => {
  const job = await JobModel.create({
    type: "close_hanging_checkouts",
    state: "pending",
    message: "Job started",
  });

  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const checkouts = await CheckoutModel.find({
      created_at: { $lte: fiveMinutesAgo },
      state: "pending",
    })
      .limit(limit)
      .sort({ created_at: 1 });
    if (checkouts.length === 0) {
      job.state = "completed";
      job.message = "No pending checkouts found";
      await job.save();
      return;
    }

    // Ensure paid checkouts are handled correctly
    for (const checkout of checkouts) {
      if (!checkout.sessionId) {
        continue;
      }

      const stripeSession = await stripe.checkout.sessions.retrieve(
        checkout.sessionId
      );
      if (stripeSession.payment_status === "paid") {
        await CheckoutService.successCheckout(checkout.sessionId);
      }
    }

    job.state = "completed";
    job.message =
      "Hanging checkouts processed successfully: " +
      checkouts.length +
      " checkouts closed";
    await job.save();
  } catch (error) {
    job.state = "error";
    job.message = "Error processing hanging checkouts: " + error.message;
    await job.save();
  }
};

export default () => CronJob.from({ cronTime, onTick, start: true, timeZone });
