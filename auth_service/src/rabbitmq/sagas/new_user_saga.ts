import rabbitMq from "../index";
import UserModel from "../../mongodb/models/user_model";
import TransactionModel from "../../mongodb/models/transaction_model";
import PwdService from "../../services/pwd_service";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "new_user:auth_service";
const producer = SagaBuilder.producer(queueName, rabbitMq)

  .onProduce(
    async (body: {
      username: string;
      email: string;
      role: string;
      password: string;
    }) => {
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
    }
  )

  .onCompensate(
    async (message: { transaction: { _id: string }; error: string }) => {
      const { error, transaction } = message;
      const { _id } = transaction;
      const exists = await TransactionModel.exists({ _id, state: "pending" });
      if (!exists) throw new Error(`Transaction not found: ${_id}`);
      await TransactionModel.updateOne({ _id }, { state: "error", error });
      return message;
    }
  )

  .onSuccess(
    async (message: {
      transaction: { _id: string };
      user: { _id: string };
    }) => {
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
    }
  )

  .build();

export const produceNewUserSaga = async (body) => await producer.produce(body);
export default async () => producer.addListeners();
