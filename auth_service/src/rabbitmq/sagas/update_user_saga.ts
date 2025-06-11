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
      await transaction.save({ session });

      user.incomplete_transactions.push({
        transaction: transaction._id,
      });

      if (body.username && body.username !== user.username) {
        stringValidator(body.username, "username", {
          min: { enabled: true, value: 3 },
          max: { enabled: true, value: 50 },
          regex: null,
        });

        const usernameExists = await UserModel.exists({
          username: body.username,
        });
        if (usernameExists) ClientError.badRequest("username already exists");

        user.username = body.username;
      }

      if (body.email && body.email !== user.email) {
        stringValidator(body.email, "email", {
          min: { enabled: true, value: 5 },
          max: { enabled: true, value: 200 },
          regex: { enabled: true, value: /^[^@]+@[^@]+\.[^@]+$/ },
        });

        const emailExists = await UserModel.exists({ email: body.email });
        if (emailExists) ClientError.badRequest("email already exists");

        user.email = body.email;
      }

      if (body.password) {
        stringValidator(body.password, "password", {
          min: { enabled: true, value: 8 },
          max: { enabled: true, value: 100 },
          regex: null,
        });
        const password = await PwdService.hashPassword(body.password);
        const login = user.logins.find((login) => login.type === "password");
        if (!login) user.logins.push({ type: "password", password });
        else login.password = password;
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

export const produceUpdateUserSaga = async (body) =>
  await producer.produce(body);
export default async () => producer.addListeners();
