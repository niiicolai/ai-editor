import { CronJob } from 'cron';
import UserAgentSessionMessage from '../mongodb/models/user_agent_session_message_model.js';
import UserAgentSessionMessageTransaction from '../../mongodb/models/user_agent_session_message_transaction_model.js';
import mongoose from 'mongoose';

// Run once every minute
const cronTime = '*/1 * * * *';

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
    console.log('INFO: User agent session message pending job started');
    try {
        const pendingMessages = await UserAgentSessionMessage
            .find({ state: 'pending' })
            .limit(limit)
            .sort({ created_at: 1 })
        if (pendingMessages.length === 0) {
            console.log('INFO: No pending messages found');
            return;
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            for (const message of pendingMessages) {
                // Update the state to 'read'
                message.state = 'read';
                await message.save({ session });

                // Create a transaction record
                const transaction = new UserAgentSessionMessageTransaction({
                    user_agent_session_message: message._id,
                    before_state: 'pending',
                    after_state: 'read',
                    parameters: {},
                });
                await transaction.save({ session });
            }
            await session.commitTransaction();
        } catch (error) {
            console.error('ERROR: Transaction failed, rolling back', error);
            await session.abortTransaction();
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('ERROR: Error in user agent session message pending job', error);
    } finally {
        console.log('INFO: User agent session message pending job finished');
    }
};


// Create a cron job
export default () => CronJob.from({ cronTime, onTick, start: true, timeZone });