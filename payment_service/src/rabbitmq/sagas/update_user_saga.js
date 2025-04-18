import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";

const queueNameIn = "update_user:agent_service";
const queueNameOut = "update_user:agent_service";

export default async () => {
  rabbitMq.addListener(`${queueNameIn}`, async (message) => {
    const { user: userData, transaction: transactionData } = message;

    const transactionExist = await TransactionModel.findOne({ _id: transactionData._id });
    if (transactionExist) return console.log("Transaction already processed");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await UserModel.findOne({ _id: userData._id });
      if (!user) throw new Error("User not found");

      const transaction = new TransactionModel({
        _id: transactionData._id,
        type: transactionData.type,
        state: "complete",
        parameters: JSON.stringify({ message }),
      });
      await transaction.save({ session });

      user.username = userData.username;
      user.email = userData.email;
      await user.save({ session });

      rabbitMq.sendMessage(`${queueNameOut}_success`, {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        transaction: {
          _id: transaction._id,
          state: transaction.state,
          type: transaction.type,
        },
      });

      await session.commitTransaction();
    } catch (error) {
      console.error(error);
      await session.abortTransaction();
      await TransactionModel.create({
        _id: transactionData._id,
        type: transactionData.type,
        state: "error",
        error: error.message,
        parameters: JSON.stringify({ message }),
      });
      rabbitMq.sendMessage(`${queueNameOut}_error`, {
        user: {
          _id: userData._id,
        },
        transaction: {
          _id: transactionData._id,
          state: "error",
          error: error.message
        },
      });
    } finally {
      await session.endSession();
    }
  });
};
