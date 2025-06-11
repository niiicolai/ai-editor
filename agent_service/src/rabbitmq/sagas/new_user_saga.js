import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";

import SagaBuilder from "../saga/SagaBuilder.js";

const queueNameIn = "new_user:auth_service";
const queueNameOut = "new_user:agent_service";

const consumer = SagaBuilder
  .chain(queueNameIn, queueNameOut, rabbitMq)
  .onConsume(async (message) => {
    const { _id, type } = message.transaction;
    const { _id: userId, username, email  } = message.user;
    const exists = await TransactionModel.exists({ _id }); 
    if (exists) throw new Error("Transaction already processed");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = new TransactionModel({
        _id,
        type,
        state: "pending",
        parameters: JSON.stringify({ message }),
      });
      const user = new UserModel({
        _id: userId,
        username,
        email,
        credit: 0,
        incomplete_transactions: [{ transaction: transaction._id }],
      });

      await transaction.save({ session });
      await user.save({ session });
      await session.commitTransaction();

      return message;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  })
  .onCompensate(async (message) => {
    const { error, transaction } = message;
    const { _id } = transaction;
    const exists = await TransactionModel.exists({ _id, state: "pending" }); 
    if (!exists) throw new Error(`Transaction not found: ${_id}`);
    await TransactionModel.updateOne({ _id }, { state: "error", error });
    return message;
  })
  .onSuccess(async (message) => {
    const { _id } = message.transaction;
    const { _id: userId } = message.user;
    const exists = await TransactionModel.exists({ _id, state: "pending" }); 
    if (!exists) throw new Error(`Transaction not found: ${_id}`);

    const user = await UserModel.findOne({ _id: userId });
    if (!user) throw new Error("User not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await TransactionModel.updateOne(
        { _id },
        { state: "completed", error: null },
        { session }
      );
      user.incomplete_transactions.pull({
        transaction: _id,
      });
      await user.save({ session });
      await session.commitTransaction();

      return message;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  })
  .build();
  
export default async () => consumer.addListeners();
