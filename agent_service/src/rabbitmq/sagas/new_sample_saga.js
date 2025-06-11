import rabbitMq from "../index.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const queueName = "new_sample:rag_evaluation_service";
const producer = SagaBuilder.producer(queueName, rabbitMq)

  .onProduce(async (body) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = new TransactionModel({
        state: "pending",
        type: queueName,
        parameters: JSON.stringify({ body }),
      });
      await transaction.save({ session });
      await session.commitTransaction();
      return {
        sample: {
          input_prompt: body.input_prompt,
          input_embedded_files: body.input_embedded_files,
          output_response: body.output_response,
          llm_config: body.llm_config,
          embedding_config: body.embedding_config,
          chunk_config: body.chunk_config,
          search_config: body.search_config,
          event_config: body.event_config,
        },
        transaction: {
          _id: transaction._id,
          state: transaction.state,
          type: transaction.type,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
    } finally {
      await session.endSession();
    }
  })

  .onCompensate(async (message) => {
    const { error, transaction } = message;
    const { _id } = transaction;
    const exists = await TransactionModel.exists({ _id, state: "pending" });
    if (!exists) throw new Error(`Transaction not found: ${_id}`);
    await TransactionModel.updateOne({ _id }, { state: "error", error });
    return message;
  })

  .onSuccess(async (message) => {
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

export const produceNewSampleSaga = async (body) =>
  await producer.produce(body);
export default async () => producer.addListeners();
