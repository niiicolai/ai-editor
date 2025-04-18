import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import PwdService from "../../services/pwd_service.js";
import mongoose from "mongoose";

import { stringValidator } from "../../validators/string_validator.js";

const queueName = "update_user:auth_service";

export const updateUserSaga = async (_id, body) => {
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

    user.incomplete_transactions.push({
        transaction: transaction._id,
      });

    if (body.username && body.username !== user.username) {
      stringValidator(body.username, "username");

      const usernameExists = await UserModel.exists({ username: body.username });
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
      login.password = await PwdService.hashPassword(body.password);
      user.logins = user.logins.map((l) => (l.type === "password" ? login : l));
    }
    
    await user.save({ session });

    const message = {
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
    console.log("Error in update user saga:", message);
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
    console.log("Success in update user saga:", message);
  });
};
