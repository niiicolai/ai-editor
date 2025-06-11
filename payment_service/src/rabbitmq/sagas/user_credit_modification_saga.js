import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import UserProductModel from "../../mongodb/models/user_product_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import CheckoutModel from "../../mongodb/models/checkout_model.js";
import ClientError from "../../errors/client_error.js";
import mongoose from "mongoose";
import SagaBuilder from "../saga/SagaBuilder.js";

const WEBSITE_URL = process.env.WEBSITE_URL;
if (!WEBSITE_URL) console.error("WEBSITE_URL should be set in the .env file");

const queueName = "user_credit_modification:payment_service";
const producer = SagaBuilder.producer(queueName, rabbitMq)

  .onProduce(async (sessionId) => {
    const checkout = await CheckoutModel.findOne({ sessionId }).populate(
      "products.product"
    );
    if (!checkout) ClientError.notFound("checkout not found");
    if (checkout.state !== "pending")
      ClientError.badRequest(
        "a checkout can only complete if its state is 'pending'."
      );

    const user = await UserModel.findOne({ _id: checkout.user });
    if (!user) ClientError.notFound("user not found");

    const mail = {
      subject: `Your Payment Was Successful! Order: ${checkout._id.toString()}`,
      content: `Hello ${
        user.username || user.email
      },\n\nThank you for your purchase! Your payment has been successfully processed. Find details at ${WEBSITE_URL}/checkout/${checkout._id.toString()}.\n\nIf you have any questions or need support, please contact us.\n\nBest regards,\nThe Team`,
      to: user.email,
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let userProducts = [];
      for (const product of checkout.products) {
        const params = { user: checkout.user };
        if (product.product.noOfCredits) {
          params.credit = { noOfCredits: product.product.noOfCredits };
        }

        const productParams = [];
        for (let i = 0; i < product.quantity; i++) {
          productParams.push({ ...params });
        }

        userProducts = await UserProductModel.create(productParams, {
          session,
          ordered: true,
        });
      }

      const transaction = new TransactionModel({
        state: "pending",
        type: queueName,
        parameters: JSON.stringify({ sessionId, mail }),
      });

      user.incomplete_transactions.push({
        transaction: transaction._id,
      });

      checkout.state = "purchased";
      
      await transaction.save({ session });
      await user.save({ session });
      await checkout.save({ session });

      await session.commitTransaction();
      return {
        user: { _id: user._id.toString() },
        userProducts,
        transaction: {
          _id: transaction._id,
          state: transaction.state,
          type: transaction.type,
        },
        mail,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
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
    const { _id: userId } = message.user;
    const exists = await TransactionModel.exists({ _id, state: "pending" });
    if (!exists) throw new Error(`Transaction not found: ${_id}`);

    const user = await UserModel.findOne({ _id: userId });
    if (!user) throw new Error("User not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await TransactionModel.updateOne(
        { _id },
        { state: "completed", error: null },
        { session }
      );
      user.incomplete_transactions.pull({
        transaction: _id,
      });
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

export const produceUserCreditModificationSaga = async (body) =>
  await producer.produce(body);
export default async () => producer.addListeners();
