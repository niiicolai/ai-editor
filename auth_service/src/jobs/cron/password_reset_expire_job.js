import UserPasswordReset from "../../mongodb/models/user_password_reset_model.js";
import JobModel from "../../mongodb/models/job_model.js";
import mongoose from "mongoose";
import { CronJob } from "cron";

const cronTime = "0 0 * * *"; // Run once every day at midnight
const timeZone = "Europe/Copenhagen";
const limit = 100;

const onTick = async () => {
  const job = await JobModel.create({
    type: "password_reset_expire",
    state: "pending",
    message: "Job started",
  });

  try {
    const expiredUserPasswordResets = await UserPasswordReset.find({
      expired_at: { $lte: new Date() },
      deleted_at: null,
    })
      .limit(limit)
      .sort({ expired_at: 1 });
    if (expiredUserPasswordResets.length === 0) {
      job.state = "completed";
      job.message = "No expired password resets found";
      await job.save();
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      for (const reset of expiredUserPasswordResets) {
        reset.expired_at = new Date();
        reset.deleted_at = new Date();
        await reset.save({ session });
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new Error("Error processing expired password resets", error);
    } finally {
      session.endSession();
    }

    job.state = "completed";
    job.message =
      "Expired password resets processed successfully: " +
      expiredUserPasswordResets.length +
      " password resets closed";
    await job.save();
  } catch (error) {
    job.state = "failed";
    job.message = "Error processing expired password resets: " + error.message;
    await job.save();
  }
};

export default () => CronJob.from({ cronTime, onTick, start: true, timeZone });
