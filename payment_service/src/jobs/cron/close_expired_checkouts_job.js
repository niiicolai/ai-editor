import CheckoutModel from "../../mongodb/models/checkout_model.js";
import JobModel from "../../mongodb/models/job_model.js";
import mongoose from 'mongoose';
import { CronJob } from 'cron';

const cronTime = '0 0 * * *'; // Run at midnight
const timeZone = 'Europe/Copenhagen';
const limit = 100;

const onTick = async () => {
    const job = await JobModel.create({
        type: 'close_expired_checkouts',
        state: 'pending',
        message: 'Job started',
    });

    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const expiredCheckouts = await CheckoutModel
            .find({ created_at: { $lte: tenMinutesAgo }, state: 'pending' })
            .limit(limit)
            .sort({ created_at: 1 });
        if (expiredCheckouts.length === 0) {
            job.state = 'completed';
            job.message = 'No expired checkouts found';
            await job.save();
            return;
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            for (const checkout of expiredCheckouts) {
                checkout.state = 'expired';
                await checkout.save({ session });
            }
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new Error('Error processing expired checkouts', error);
        } finally {
            session.endSession();
        }

        job.state = 'completed';
        job.message = 'Expired checkouts processed successfully: ' + expiredCheckouts.length + ' checkouts closed';
        await job.save();
    } catch (error) {
        job.state = 'error';
        job.message = 'Error processing expired checkouts: ' + error.message;
        await job.save();
    }
};

export default () => CronJob.from({ cronTime, onTick, start: true, timeZone });
