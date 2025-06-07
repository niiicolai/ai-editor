import rabbitMq from "./index.js";
import TransactionModel from "../mongodb/models/transaction_model.js";
import SagaBuilder from "./saga/SagaBuilder.js";
import { GmailService } from "../services/gmail_service.js";

export const createSendEmailSaga = (queueName) => {
  const consumer = SagaBuilder.consumer(queueName, rabbitMq)

    .onConsume(async (message) => {
      const { mail, transaction } = message;

      const existingTransaction = await TransactionModel.findOne({
        _id: transaction._id,
      });
      if (existingTransaction) throw new Error("Transaction already processed");

      try {
        await GmailService.sendMail(mail.content, mail.subject, mail.to);

        const newTransaction = new TransactionModel({
          _id: transaction._id,
          type: transaction.type,
          state: "complete",
          parameters: JSON.stringify({ message }),
        });
        await newTransaction.save();

        return {
          transaction: newTransaction,
        };
      } catch (error) {
        throw new Error(`Error sending email: ${error.message}`);
      }
    })

    .build();

  return { consumer, addListeners: () => consumer.addListeners() };
};
