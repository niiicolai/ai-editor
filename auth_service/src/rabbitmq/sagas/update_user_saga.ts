import rabbitMq from "../index";
import UserModel from "../../mongodb/models/user_model";
import TransactionModel from "../../mongodb/models/transaction_model";
import PwdService from "../../services/pwd_service";
import mongoose from "mongoose";
import ClientError from "../../errors/client_error";
import SagaBuilder from "../saga/SagaBuilder.js";
import { stringValidator } from "../../validators/string_validator";

const queueName = "update_user:auth_service";
const producer = SagaBuilder.producer(queueName, rabbitMq)

  .onProduce(async (body) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await UserModel.findOne({ _id: body._id, deleted_at: null });
      if (!user) throw new Error("User not found");

      const transaction = new TransactionModel({
        state: "pending",
        type: queueName,
        parameters: JSON.stringify({ _id: body._id }),
      });
      await transaction.save({ session });

      user.incomplete_transactions.push({
        transaction: transaction._id,
      });

      if (body.username && body.username !== user.username) {
        stringValidator(body.username, "username");

        const usernameExists = await UserModel.exists({
          username: body.username,
        });
        if (usernameExists) ClientError.badRequest("username already exists");

        user.username = body.username;
      }

      if (body.email && body.email !== user.email) {
        stringValidator(body.email, "email");

        const emailExists = await UserModel.exists({ email: body.email });
        if (emailExists) ClientError.badRequest("email already exists");

        user.email = body.email;
      }

      if (body.password) {
        stringValidator(body.password, "password");

        const login = user.logins.find((login) => login.type === "password");
        if (!login) ClientError.badRequest("No password type found")
        else {
          login.password = await PwdService.hashPassword(body.password);
        }
      }

      await user.save({ session });
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
        { state: "error", error: message.transaction.error }
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

      user.incomplete_transactions.pull({ transaction: message.transaction._id });
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

export const produceUpdateUserSaga = async (body) => await producer.produce(body);
export default async () => producer.addListeners();
