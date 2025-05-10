import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import PwdService from "../../services/pwd_service.js";
import mongoose from "mongoose";
import SagaBuilder from "../../../../saga/SagaBuilder.js";

const queueName = "new_user:auth_service";
const producer = SagaBuilder.producer(queueName, rabbitMq)

  .onProduce(async (body) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      body.password = await PwdService.hashPassword(body.password);

      const transaction = new TransactionModel({
        state: "pending",
        type: queueName,
        parameters: JSON.stringify({ ...body }),
      });
      const user = new UserModel({
        username: body.username,
        email: body.email,
        role: body.role,
        incomplete_transactions: [{ transaction: transaction._id }],
        logins: [{ type: "password", password: body.password }],
      });

      await transaction.save({ session: session });
      await user.save({ session: session });
      await session.commitTransaction();
      return {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        transaction: {
          _id: transaction._id,
          state: transaction.state,
          type: transaction.type,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
    } finally {
      await session.endSession();
    }
  })

  .onCompensate(async (message) => {
    const transaction = await TransactionModel.findOne(
      { _id: message.transaction._id, state: "pending" }
    );
    if (!transaction) throw new Error("Transaction not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await TransactionModel.updateOne(
        { _id: message.transaction._id },
        { state: "error", error: message.transaction.error },
        { session }
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error('onCompensate', error);
    } finally {
      await session.endSession();
    }
  })

  .onSuccess(async (message) => {
    const transaction = await TransactionModel.findOne(
      { _id: message.transaction._id, state: "pending" },
    );
    if (!transaction) throw new Error("Transaction not found");

    const user = await UserModel.findOne(
      { _id: message.user._id }
    );
    if (!user) throw new Error("user not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      user.incomplete_transactions = user.incomplete_transactions.filter(
        (t) => t.transaction.toString() !== message.transaction._id
      );
      await user.save({ session });

      await TransactionModel.updateOne(
        { _id: message.transaction._id },
        { state: "completed", error: null },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error('onSuccess', error);
    } finally {
      await session.endSession();
    }
  })

  .build();

export const produceNewUserSaga = async (body) => await producer.produce(body);
export default async () => producer.addListeners();
