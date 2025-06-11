import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";

import SagaBuilder from "../saga/SagaBuilder.js";

const queueNameIn = "new_user:auth_service";
const queueNameOut = "new_user:agent_service";

const consumer = SagaBuilder()
  .chain(queueNameIn, queueNameOut, rabbitMq)
  .onConsumeIn(async (message) => {
    const { user: userData, transaction: transactionData } = message;

    if (await TransactionModel.findOne({
      _id: transactionData._id,
    })) return console.log("Transaction already processed");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = new TransactionModel({
        _id: transactionData._id,
        type: transactionData.type,
        state: "pending",
        parameters: JSON.stringify({ message }),
      });
      
      const user = new UserModel({
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        credit: 0,
        incomplete_transactions: [{ transaction: transaction._id }],
      });

      await transaction.save({ session });
      await user.save({ session });
      await session.commitTransaction();

      return message;
    } catch (error) {
      await session.abortTransaction();
      throw new Error("Error processing transaction", error);
    } finally {
      await session.endSession();
    }
  })
  .onCompensateIn(async (message) => {
    if (!(await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending",
    }))) return console.log("Transaction not found:", message.transaction._id);

    await TransactionModel.updateOne(
      { _id: message.transaction._id },
      { state: "error", error: message.transaction.error }
    );
    return message;
  })
  .onConsumeOut(async (message) => {
    if (!(await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending",
    }))) return console.log("Transaction not found:", message.transaction._id);

    await TransactionModel.updateOne(
      { _id: message.transaction._id },
      { state: "error", error: message.transaction.error }
    );
    return message;
  })
  .onSuccessOut(async (message) => {
    if (!(await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending",
    }))) return console.log("Transaction not found:", message.transaction._id);

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
        (t) => t.transaction.toString() !== message.transaction._id
      );

      rabbitMq.sendMessage(`${queueNameIn}_success`, {
        user: {
          _id: message.user._id,
        },
        transaction: {
          _id: message.transaction._id,
          state: "completed",
        },
      });

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
//export default async () => consumer.addListeners();

const compensate = (message, error) => {
  TransactionModel.create({
    _id: message.transaction._id,
    type: message.transaction.type,
    state: "error",
    error: error.message,
    parameters: JSON.stringify({ message }),
  });
  rabbitMq.sendMessage(`${queueNameIn}_error`, {
    user: {
      _id: message.user._id,
    },
    transaction: {
      _id: message.transaction._id,
      state: "error",
      error: error.message,
    },
  });
};

const success = (user, transaction) => {
  rabbitMq.sendMessage(`${queueNameOut}`, {
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
  });
};

export default async () => {
  rabbitMq.addListener(`${queueNameIn}`, async (message) => {
    if (await TransactionModel.findOne({ _id: message.transaction._id }))
      return console.log("Transaction already processed");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (await UserModel.findOne({ _id: message.user._id }))
        throw new Error("User already exists");

      const transaction = new TransactionModel({
        _id: message.transaction._id,
        type: message.transaction.type,
        state: "pending",
        parameters: JSON.stringify({ message }),
      });

      const user = new UserModel({
        _id: message.user._id,
        username: message.user.username,
        email: message.user.email,
        incomplete_transactions: [{ transaction: transaction._id }],
      });

      await transaction.save({ session });
      await user.save({ session });
      success(user, transaction);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      compensate(message, error);
      console.error(error);
    } finally {
      await session.endSession();
    }
  });

  rabbitMq.addListener(`${queueNameOut}_error`, async (message) => {
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
    rabbitMq.sendMessage(`${queueNameIn}_error`, {
      user: {
        _id: message.user._id,
      },
      transaction: {
        _id: message.transaction._id,
        state: "error",
        error: message.transaction.error,
      },
    });
    console.log("Error in new user saga:", message);
  });

  rabbitMq.addListener(`${queueNameOut}_success`, async (message) => {
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
        (t) => t.transaction.toString() !== message.transaction._id
      );

      rabbitMq.sendMessage(`${queueNameIn}_success`, {
        user: {
          _id: message.user._id,
        },
        transaction: {
          _id: message.transaction._id,
          state: "completed",
        },
      });

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
