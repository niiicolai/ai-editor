import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "new_user:agent_service";
const consumer = SagaBuilder.consumer(queueName, rabbitMq)

  .onConsume(async (message) => {
    const { _id, type } = message.transaction;
    const { _id: userId, username, email } = message.user;
    
    const exists = await TransactionModel.exists({ _id }); 
    if (exists) throw new Error("Transaction already processed");

    const userExists = await UserModel.findOne({ _id: userId });
    if (userExists) throw new Error("User already exists");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = new TransactionModel({
        _id,
        type,
        state: "completed",
        parameters: JSON.stringify({ message }),
      });

      const user = new UserModel({
        _id: userId,
        username,
        email,
        incomplete_transactions: [],
      });

      await transaction.save({ session });
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

export default async () => consumer.addListeners();
