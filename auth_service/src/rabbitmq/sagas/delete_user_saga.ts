import rabbitMq from "../index";
import UserModel from "../../mongodb/models/user_model";
import TransactionModel from "../../mongodb/models/transaction_model";
import SagaBuilder from "../saga/SagaBuilder.js";
import mongoose from "mongoose";

const queueName = "delete_user:auth_service";
const producer = SagaBuilder.producer(queueName, rabbitMq)

  .onProduce(async (body) => {
    const user = await UserModel.findOne({ _id: body._id, deleted_at: null });
    if (!user) throw new Error("User not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      user.deleted_at = new Date();

      const transaction = new TransactionModel({
        state: "pending",
        type: queueName,
        parameters: JSON.stringify({ _id: body._id }),
      });
      await transaction.save({ session });

      user.incomplete_transactions.push({
        transaction: transaction._id,
      });
      await user.save({ session });

      await session.commitTransaction();

      return {
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
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  })

  .onCompensate(async (message) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const transaction = await TransactionModel.findOne(
        { _id: message.transaction._id, state: "pending" },
        { session }
      );
      if (!transaction) throw new Error("Transaction not found");

      await TransactionModel.updateOne(
        { _id: message.transaction._id },
        { state: "error", error: message.transaction.error },
        { session }
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  })

  .onSuccess(async (message) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const transaction = await TransactionModel.findOne(
        { _id: message.transaction._id, state: "pending" },
        { session }
      );
      if (!transaction) throw new Error("Transaction not found");

      const user = await UserModel.findOne(
        { _id: message.user._id },
        { session }
      );
      if (!user) throw new Error("User not found");

      user.incomplete_transactions.pull({
        transaction: message.transaction._id,
      });
      await user.save({ session });

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
  })

  .build();

export const produceDeleteUserSaga = async (body) =>
  await producer.produce(body);
export default async () => producer.addListeners();
