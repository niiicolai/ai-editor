import rabbitMq from "../index.js";
import UserModel from "../../mongodb/models/user_model.js";
import UserProductModel from "../../mongodb/models/user_product_model.js";
import TransactionModel from "../../mongodb/models/transaction_model.js";
import CheckoutModel from "../../mongodb/models/checkout_model.js";
import ClientError from "../../errors/clientError.js";
import mongoose from "mongoose";
import SagaBuilder from "../../../../saga/SagaBuilder.js";

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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = new TransactionModel({
        state: "pending",
        type: queueName,
        parameters: JSON.stringify({ sessionId }),
      });
      await transaction.save({ session });

      user.incomplete_transactions.push({
        transaction: transaction._id,
      });
      await user.save({ session });

      checkout.state = "purchased";
      await checkout.save({ session });

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

      await session.commitTransaction();
      return {
        userId: user._id.toString(),
        userProducts,
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
    const transaction = await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending",
    });
    if (!transaction) throw new Error("Transaction not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await TransactionModel.updateOne(
        { _id: message.transaction._id },
        { state: "error", error: message.transaction.error },
        { session }
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("onCompensate", error);
    } finally {
      await session.endSession();
    }
  })

  .onSuccess(async (message) => {
    const transaction = await TransactionModel.findOne({
      _id: message.transaction._id,
      state: "pending",
    });
    if (!transaction) throw new Error("Transaction not found");

    const user = await UserModel.findOne({ _id: message.userId });
    if (!user) throw new Error("user not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      user.incomplete_transactions = user.incomplete_transactions.filter(
        (t) => t.transaction.toString() !== message.transaction._id
      );
      await user.save({ session });

      await TransactionModel.updateOne(
        { _id: message.transaction._id },
        { state: "completed", error: null },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("onSuccess", error);
    } finally {
      await session.endSession();
    }
  })

  .build();

export const produceUserCreditModificationSaga = async (body) => await producer.produce(body);
export default async () => producer.addListeners();
