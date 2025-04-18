import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";

const queueNameIn = "new_user:agent_service";
const queueNameOut = "new_user:agent_service";

const compensate = (message, error) => {
  TransactionModel.create({
    _id: message.transaction._id,
    type: message.transaction.type,
    state: "error",
    error: error.message,
    parameters: JSON.stringify({ message }),
  });
  rabbitMq.sendMessage(`${queueNameOut}_error`, {
    user: {
      _id: message.user._id,
    },
    transaction: {
      _id: message.transaction._id,
      state: "error",
      error: error.message
    },
  });
}

const success = (user, transaction) => {
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
}

export default async () => {
  rabbitMq.addListener(`${queueNameIn}`, async (message) => {
    if (await TransactionModel.findOne({ _id: message.transaction._id })) 
      return console.log("Transaction already processed");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (await UserModel.findOne({ _id: message.user._id })) 
        throw new Error("User already exists");

      const transaction = new TransactionModel({
        _id: message.transaction._id,
        type: message.transaction.type,
        state: "complete",
        parameters: JSON.stringify({ message }),
      });

      const user = new UserModel({
        _id: message.user._id,
        username: message.user.username,
        email: message.user.email,
        incomplete_transactions: [],
      });

      await transaction.save({ session });
      await user.save({ session });
      success(user, transaction);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      compensate(message, error);
      console.error(error);
    } finally {
      await session.endSession();
    }
  });
};
