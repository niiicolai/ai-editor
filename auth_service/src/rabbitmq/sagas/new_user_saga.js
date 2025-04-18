import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import PwdService from "../../services/pwd_service.js";
import mongoose from "mongoose";

const queueName = "new_user:auth_service";

export const newUserSaga = async (body) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let user;
  try {
    const transaction = new TransactionModel({
      state: "pending",
      type: queueName,
      parameters: JSON.stringify({...body, password: 'REDACTED'}),
    });
    await transaction.save({ session });

    user = new UserModel({
      username: body.username,
      email: body.email,
      incomplete_transactions: [{ transaction: transaction._id }],
      logins: [
        {
          type: "password",
          password: await PwdService.hashPassword(body.password),
        },
      ],
    });

    await user.save({ session });

    const message = {
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

    rabbitMq.sendMessage(queueName, message);
    
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  return user;
};

export default async () => {
  rabbitMq.addListener(`${queueName}_error`, async (message) => {
    const transaction = await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending"
    });
    if (!transaction)
      return console.log("Transaction not found:", message.transaction._id);

    await TransactionModel.updateOne(
      { _id: message.transaction._id },
      { state: "error", error: message.transaction.error },
    );
    console.log("Error in new user saga:", message);
  });

  rabbitMq.addListener(`${queueName}_success`, async (message) => {
    const transaction = await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending"
    });
    if (!transaction) return console.log("Transaction not found:", message.transaction._id);

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
      
      user.incomplete_transactions = user
        .incomplete_transactions
        .filter(t=> t.transaction.toString() !== message.transaction._id);

      await user.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
    console.log("Success in new user saga:", message);
  });
};
