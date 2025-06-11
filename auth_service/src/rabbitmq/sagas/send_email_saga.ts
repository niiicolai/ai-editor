import rabbitMq from "../index";
import TransactionModel from "../../mongodb/models/transaction_model";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "send_email:auth_service";
const producer = SagaBuilder.producer(queueName, rabbitMq)

  .onProduce(async (body: { subject: string; content: string; to: string }) => {
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

  .onCompensate(
    async (message: { transaction: { _id: string }; error: string }) => {
      const { error, transaction } = message;
      const { _id } = transaction;
      const exists = await TransactionModel.exists({ _id, state: "pending" });
      if (!exists) throw new Error(`Transaction not found: ${_id}`);
      await TransactionModel.updateOne({ _id }, { state: "error", error });
      return message;
    }
  )

  .onSuccess(async (message: { transaction: { _id: string } }) => {
    const { _id } = message.transaction;
    const exists = await TransactionModel.exists({ _id, state: "pending" });
    if (!exists) throw new Error(`Transaction not found: ${_id}`);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await TransactionModel.updateOne(
        { _id },
        { state: "completed", error: null },
        { session }
      );
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

export const produceSendEmailSaga = async (body: {
  subject: string;
  content: string;
  to: string;
}) => await producer.produce(body);
export default async () => producer.addListeners();
