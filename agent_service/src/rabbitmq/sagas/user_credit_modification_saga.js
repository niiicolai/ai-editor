import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import UserCreditModificationModel from "../../mongodb/models/user_credit_modification_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";

import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "user_credit_modification:payment_service";
const consumer = SagaBuilder.consumer(queueName, rabbitMq)

  .onConsume(async (message) => {
    const { userId, userProducts, transaction } = message;

    const user = await UserModel.findOne({ _id: userId, deleted_at: null });
    if (!user) throw new Error("User not found");

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

      for (const userProduct of userProducts) {
        await UserCreditModificationModel.create(
          [{
            user_product: userProduct._id,
            amount: userProduct.credit.noOfCredits,
            user: user._id,
          }],
          { session }
        );

        user.credit += userProduct.credit.noOfCredits; 
      }

      await user.save({ session });
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
