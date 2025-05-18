import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "new_user:agent_service";
const consumer = SagaBuilder.consumer(queueName, rabbitMq)

  .onConsume(async (message) => {
    const { user, transaction } = message;

    if (await UserModel.findOne({ _id: user._id, deleted_at: null })) 
      throw new Error("User already exists");

    const existingTransaction = await TransactionModel.findOne({
      _id: transaction._id,
    });
    if (existingTransaction) throw new Error("Transaction already processed");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newTransaction = new TransactionModel({
        _id: transaction._id,
        type: transaction.type,
        state: "complete",
        parameters: JSON.stringify({ message }),
      });
      await newTransaction.save({ session });

      const newUser = new UserModel({
        _id: user._id,
        username: user.username,
        email: user.email,
        incomplete_transactions: [],
      });

      await newUser.save({ session });
      await session.commitTransaction();

      return {
        user: newUser,
        transaction: newTransaction,
      };

    } catch (error) {
      await session.abortTransaction();
      throw new Error("Error processing transaction", error);
    } finally {
      await session.endSession();
    }
  })

  .build();

export default async () => consumer.addListeners();
