import rabbitMq from "../index.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "send_email:payment_service";
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
        mail: {
          subject: body.subject,
          content: body.content,
          to: body.to,
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
    const transaction = await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending",
    });
    if (!transaction) throw new Error("Transaction not found");

    try {
      await TransactionModel.updateOne(
        { _id: message.transaction._id },
        { state: "error", error: message.error },
      );
    } catch (error) {
      console.error("Error updating transaction state", error);
      throw error;
    }
  })

  .onSuccess(async (message) => {
    const transaction = await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending",
    });
    if (!transaction) throw new Error("Transaction not found");

    try {
      await TransactionModel.updateOne(
        { _id: message.transaction._id },
        { state: "completed", error: null },
      );
    } catch (error) {
      console.error("Error updating transaction state", error);
      throw error;
    }
  })

  .build();

export const produceSendEmailSaga = async (body) =>
  await producer.produce(body);
export default async () => producer.addListeners();
