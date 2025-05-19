import rabbitMq from "../index.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";

import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "send_email:email_service";
const consumer = SagaBuilder.consumer(queueName, rabbitMq)

  .onConsume(async (message) => {
    const { transaction } = message;

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
      console.warn('TODO: SEND EMAIL')
      await session.commitTransaction();

      return {
        userId,
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
