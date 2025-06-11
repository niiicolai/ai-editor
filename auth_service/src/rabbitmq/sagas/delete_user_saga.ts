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
      const transaction = new TransactionModel({
        state: "pending",
        type: queueName,
        parameters: JSON.stringify({ _id: body._id }),
      });

      user.deleted_at = new Date();
      user.incomplete_transactions.push({
        transaction: transaction._id,
      });

      await transaction.save({ session });
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

export const produceDeleteUserSaga = async (body) =>
  await producer.produce(body);
export default async () => producer.addListeners();
