import rabbitMq from "../index";
import TransactionModel from "../../mongodb/models/transaction_model";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "new_email:auth_service";
const producer = SagaBuilder.producer(queueName, rabbitMq)

  .onProduce(async (body) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = new TransactionModel({
        state: "pending",
        type: queueName,
        parameters: JSON.stringify({ ...body }),
      });
      await transaction.save({ session });
      await session.commitTransaction();

      return {
        subject: body.subject,
        content: body.content,
        email: body.email,
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
        { state: "error", error: message.transaction.error },
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

  .onSuccess(async (message) => {
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

export const produceSendEmailSaga = async (body) => await producer.produce(body);
export default async () => producer.addListeners();
