import rabbitMq from "./index.js";
import TransactionModel from "../mongodb/models/transaction_model.js";
import SagaBuilder from "./saga/SagaBuilder.js";
import { GmailService } from "../services/gmail_service.js";

export const createSendEmailSaga = (queueName) => {
  const consumer = SagaBuilder.consumer(queueName, rabbitMq)

    .onConsume(async (message) => {
      const { _id, type } = message.transaction;
      const { content, subject, to } = message.mail;
      const exists = await TransactionModel.exists({ _id }); 
      if (exists) throw new Error("Transaction already processed");

      try {
        const transaction = new TransactionModel({
          _id,
          type,
          state: "completed",
          parameters: JSON.stringify({ message }),
        });

        await GmailService.sendMail(content, subject,to);
        await transaction.save();

        return message;
      } catch (error) {
        throw error;
      }
    })
    .build();

  return { consumer, addListeners: () => consumer.addListeners() };
};
