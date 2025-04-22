import rabbitMq from "../index.js";
import UserProductService from "../../services/user_product_service.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";

const queueName = "update_credit:payment_service";

export const updateCreditSaga = async (userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const creditInfo = await UserProductService.getCreditsInfo(userId);
        const transaction = new TransactionModel({
            state: "pending",
            type: queueName,
            parameters: JSON.stringify({ ...creditInfo, userId }),
        });
        await transaction.save({ session });

        const message = {
            userId,
            creditInfo: creditInfo,
            transaction: {
                _id: transaction._id,
                state: transaction.state,
                type: transaction.type,
            },
        };

        rabbitMq.sendMessage(queueName, message);

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

export default async () => {
    rabbitMq.addListener(`${queueName}_error`, async (message) => {
        const transaction = await TransactionModel.findOne({
            _id: message.transaction._id,
            state: "pending"
        });
        if (!transaction)
            return console.log("Transaction not found:", message.transaction._id);

        await TransactionModel.updateOne(
            { _id: message.transaction._id },
            { state: "error", error: message.transaction.error },
        );
        console.log("Error in update credit saga:", message);
    });

    rabbitMq.addListener(`${queueName}_success`, async (message) => {
        const transaction = await TransactionModel.findOne({
            _id: message.transaction._id,
            state: "pending"
        });
        if (!transaction) return console.log("Transaction not found:", message.transaction._id);

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await TransactionModel.updateOne(
                { _id: message.transaction._id },
                { state: "completed", error: null },
                { session }
            );

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
        console.log("Success in update credit saga:", message);
    });
};
