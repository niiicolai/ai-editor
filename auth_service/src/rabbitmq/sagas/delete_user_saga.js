import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";

const queueName = "delete_user:auth_service";

export const deleteUserSaga = async (_id) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findOne({ _id, deleted_at: null });
    if (!user) throw new Error("User not found");

    const transaction = new TransactionModel({
      state: "pending",
      type: queueName,
      parameters: JSON.stringify({ _id }),
    });
    await transaction.save({ session });

    user.deleted_at = new Date();
    user.incomplete_transactions.push({
      transaction: transaction._id,
    });
    await user.save({ session });

    const message = {
      user: {
        _id: user._id,
        deleted_at: user.deleted_at,
      },
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
      state: "pending",
    });
    if (!transaction)
      return console.log("Transaction not found:", message.transaction._id);

    await TransactionModel.updateOne(
      { _id: message.transaction._id },
      { state: "error", error: message.transaction.error }
    );
    console.log("Error in delete user saga:", message);
  });

  rabbitMq.addListener(`${queueName}_success`, async (message) => {
    const transaction = await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending",
    });
    if (!transaction)
      return console.log("Transaction not found:", message.transaction._id);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await TransactionModel.updateOne(
        { _id: message.transaction._id },
        { state: "completed", error: null },
        { session }
      );

      const user = await UserModel.findOne({ _id: message.user._id });
      if (!user) throw new Error("User not found");

      user.incomplete_transactions = user.incomplete_transactions.filter(
        (t) => t.toString() === message.transaction._id
      );

      await user.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
    console.log("Success in delete user saga:", message);
  });
};
