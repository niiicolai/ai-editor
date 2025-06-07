import CheckoutModel from "../../mongodb/models/checkout_model.js";
import JobModel from "../../mongodb/models/job_model.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import CheckoutService from "../../services/checkout_service.js";
import { CronJob } from "cron";

const API_KEY = process.env.STRIPE_API_KEY;
if (!API_KEY) console.error("STRIPE_API_KEY not set in .env");

const stripe = new Stripe(API_KEY);

const cronTime = "0 0 * * *"; // Run at midnight
const timeZone = "Europe/Copenhagen";
const limit = 100;

const onTick = async () => {
  const job = await JobModel.create({
    type: "close_expired_checkouts",
    state: "pending",
    message: "Job started",
  });

  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const expiredCheckouts = await CheckoutModel.find({
      created_at: { $lte: tenMinutesAgo },
      state: "pending",
    })
      .limit(limit)
      .sort({ created_at: 1 });
    if (expiredCheckouts.length === 0) {
      job.state = "completed";
      job.message = "No expired checkouts found";
      await job.save();
      return;
    }

    // Ensure paid checkouts are handled correctly
    const filteredCheckouts = [];
    for (const checkout of expiredCheckouts) {
      if (!checkout.sessionId) {
        filteredCheckouts.push(checkout);
        continue;
      }

      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(
          checkout.sessionId
        );
        if (stripeSession.payment_status === "paid") {
          await CheckoutService.successCheckout(checkout.sessionId);
        } else {
            filteredCheckouts.push(checkout);
        }
      } catch (err) {
        // If Stripe session retrieval fails, treat as expired
        filteredCheckouts.push(checkout);
      }
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      for (const checkout of filteredCheckouts) {
        checkout.state = "expired";
        await checkout.save({ session });
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new Error("Error processing expired checkouts", error);
    } finally {
      session.endSession();
    }

    job.state = "completed";
    job.message =
      "Expired checkouts processed successfully: " +
      filteredCheckouts.length +
      " checkouts closed";
    await job.save();
  } catch (error) {
    job.state = "error";
    job.message = "Error processing expired checkouts: " + error.message;
    await job.save();
  }
};

export default () => CronJob.from({ cronTime, onTick, start: true, timeZone });
