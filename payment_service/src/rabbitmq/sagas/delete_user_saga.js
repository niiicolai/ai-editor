import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "delete_user:agent_service";
const consumer = SagaBuilder.consumer(queueName, rabbitMq)

  .onConsume(async (message) => {
    const { user: userData, transaction } = message;

    const user = await UserModel.findOne({ _id: userData._id });
      if (!user) throw new Error("User not found");

    const existingTransaction = await TransactionModel.findOne({
      _id: transaction._id,
    });
    if (existingTransaction) throw new Error("Transaction already processed");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newTransaction = new TransactionModel({
        _id: transaction._id,
        type: transaction.type,
        state: "complete",
        parameters: JSON.stringify({ message }),
      });
      await newTransaction.save({ session });

      user.deleted_at = userData.deleted_at;
      await user.save({ session });
      await session.commitTransaction();

      return {
        user,
        transaction: newTransaction,
      };

    } catch (error) {
      await session.abortTransaction();
      throw new Error("Error processing transaction", error);
    } finally {
      await session.endSession();
    }
  })

  .build();

export default async () => consumer.addListeners();

/*
const queueNameIn = "delete_user:agent_service";
const queueNameOut = "delete_user:agent_service";

export default async () => {
  rabbitMq.addListener(`${queueNameIn}`, async (message) => {
    const { user: userData, transaction: transactionData } = message;

    const transactionExist = await TransactionModel.findOne({ _id: transactionData._id });
    if (transactionExist) return console.log("Transaction already processed");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const transaction = new TransactionModel({
        _id: transactionData._id,
        type: transactionData.type,
        state: "complete",
        parameters: JSON.stringify({ message }),
      });
      await transaction.save({ session });

      const user = await UserModel.findOne({ _id: userData._id });
      if (!user) throw new Error("User not found");

      user.deleted_at = message.user.deleted_at;
      await user.save({ session });
  
      rabbitMq.sendMessage(`${queueNameOut}_success`, {
        user: {
          _id: userData._id,
        },
        transaction: {
          _id: transaction._id,
          state: transaction.state,
        },
      });

      await session.commitTransaction();
    } catch (error) {
      console.error(error);
      await session.abortTransaction();

      const transaction = new TransactionModel({
        _id: transactionData._id,
        type: transactionData.type,
        state: "error",
        error: error.message,
        parameters: JSON.stringify({ message }),
      });
      await transaction.save();

      rabbitMq.sendMessage(`${queueNameOut}_error`, {
        user: {
          _id: userData._id,
        },
        transaction: {
          _id: transactionData._id,
          state: "error",
          error: error.message,
        },
      });

    } finally {
      await session.endSession();
    }
  });
};
*/
