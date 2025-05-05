import UserPasswordReset from "../../mongodb/models/user_password_reset_model.js";
import mongoose from 'mongoose';
import { CronJob } from 'cron';

// Run once every day at midnight
const cronTime = '0 0 * * *';

// Copenhagen timezone
const timeZone = 'Europe/Copenhagen';

// limit the number of messages to process in one tick
const limit = 100;

/**
 * @function onTick
 * @description The function to run on tick.
 * @returns {Promise<void>}
 */
const onTick = async () => {
    console.log('INFO: Password Reset Expire Job Started');
    try {
        const expiredUserPasswordResets = await UserPasswordReset
            .find({ expired_at: { $lte: new Date() }, deleted_at: null })
            .limit(limit)
            .sort({ expired_at: 1 });
        if (expiredUserPasswordResets.length === 0) {
            console.log('INFO: No expired user password resets found');
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
            console.error('ERROR: Transaction failed, rolling back', error);
            await session.abortTransaction();
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('ERROR: Error In Password Reset Expire Job', error);
    } finally {
        console.log('INFO: Password Reset Expire Job Finished');
    }
};

// Create a cron job
export default () => CronJob.from({ cronTime, onTick, start: true, timeZone });
