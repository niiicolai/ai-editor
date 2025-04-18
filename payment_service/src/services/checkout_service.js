import CheckoutModel from '../mongodb/models/checkout_model.js';
import UserModel from '../mongodb/models/user_model.js';
import UserProductModel from '../mongodb/models/user_product_model.js';
import dto from "../dto/checkout_dto.js";
import ClientError from '../errors/clientError.js';
import Stripe from 'stripe';
import mongoose from 'mongoose';

import { idValidator } from "../validators/id_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";
import { objectValidator } from "../validators/object_validator.js";

const API_KEY = process.env.STRIPE_API_KEY;
if (!API_KEY) console.error("STRIPE_API_KEY not set in .env");

const DOMAIN = process.env.DOMAIN;
if (!DOMAIN) console.error("DOMAIN is not set in .env");

const stripe = new Stripe(API_KEY);

export default class CheckoutService {
    /**
     * @function find
     * @description Get checkout by id
     * @param {String} _id
     * @param {String} userId
     * @returns {Promise<Object>}
     */
    static async find(_id, userId) {
        idValidator(_id);

        const user = await UserModel.findOne({ _id: userId, deleted_at: null });
        if (!user) ClientError.notFound("user not found");

        const checkout = await CheckoutModel
            .findOne({ _id, user: userId })
            .populate('products.product');
        if (!checkout) ClientError.notFound("checkout not found");

        return dto(checkout);
    }

    /**
     * @function findAll
     * @description Paginate checkouts by userId
     * @param {Number} page
     * @param {Number} limit
     * @param {String} userId
     * @param {String} state
     * @returns {Promise<Object>}
     */
    static async findAll(page = 1, limit = 10, userId, state) {
        paginatorValidator(page, limit);
        idValidator(userId, "userId");
        stringValidator(state, "state");

        const user = await UserModel.findOne({ _id: userId, deleted_at: null });
        if (!user) ClientError.notFound("user not found");

        const query = { user: userId, state };
        const checkouts = await CheckoutModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 })
            .populate('products.product');
        const total = await CheckoutModel.countDocuments(query);
        const pages = Math.ceil(total / limit);

        return {
            checkouts: checkouts.map(dto),
            page,
            limit,
            total,
            pages,
        };
    }

    /**
     * @function findOrCreate
     * @description Find or create checkout
     * @param {String} userId
     * @returns {Promise<Object>}
     */
    static async findOrCreate(userId) {
        idValidator(userId, "userId");

        const user = await UserModel.findOne({ _id: userId, deleted_at: null });
        if (!user) ClientError.notFound("user not found");

        const checkouts = await CheckoutModel
            .find({ state: "open", user: userId })
            .limit(1)
            .sort({ created_at: -1 })
            .populate('products.product');
        if (checkouts.length > 0) return dto(checkouts[0]);
        else {
            const checkout = new CheckoutModel({ user: userId, products: [] });
            await checkout.save();

            return dto(checkout);
        }
    }

    /**
     * @function create
     * @description Create checkout
     * @param {Object} body
     * @param {String} userId
     * @returns {Promise<Object>}
     */
    static async create(body, userId) {
        objectValidator(body, "body");
        idValidator(userId, "userId");

        const user = await UserModel.findOne({ _id: userId, deleted_at: null });
        if (!user) ClientError.notFound("user not found");

        try {
            const checkout = new CheckoutModel({
                products: body.products,
                user: user._id,
            });

            await checkout.save();

            return await this.find(checkout._id.toString(), userId);
        } catch (error) {
            console.error("Error creating checkout", error);
            throw new Error("Error creating checkout", error);
        }
    }

    /**
     * @function update
     * @description Update checkout
     * @param {String} _id
     * @param {Object} body
     * @param {String} userId
     * @returns {Promise<Object>}
     */
    static async update(_id, body, userId) {
        idValidator(_id);
        idValidator(userId, "userId");
        objectValidator(body, "body");

        const user = await UserModel.findOne({ _id: userId, deleted_at: null });
        if (!user) ClientError.notFound("user not found");

        const checkout = await CheckoutModel.findOne({ _id, user: userId });
        if (!checkout) ClientError.notFound("checkout not found");
        if (checkout.state !== "open") ClientError.badRequest("a checkout can only be updated if its state is 'open'.")

        try {
            if (body.products) checkout.products = body.products;
            if (body.state) checkout.state = body.state;
            await checkout.save();
            return await this.find(checkout._id.toString(), userId);
        } catch (error) {
            console.error("Error updating checkout", error);
            throw new Error("Error updating checkout", error);
        }
    }

    /**
     * @function startCheckout
     * @description Start checkout
     * @param {String} _id
     * @param {String} userId
     * @returns {Promise<Object>}
     */
    static async startCheckout(_id, userId) {
        idValidator(_id);
        idValidator(userId, "userId");

        const user = await UserModel.findOne({ _id: userId, deleted_at: null });
        if (!user) ClientError.notFound("user not found");

        const checkout = await CheckoutModel
            .findOne({ _id, user: userId })
            .populate('products.product');
        if (!checkout) ClientError.notFound("checkout not found");
        if (!checkout.products || !checkout.products.length) ClientError.badRequest("checkout must have a least one product");
        if (checkout.state !== "open") ClientError.badRequest("a checkout can only be 'checked out' if its state is 'open'.")

        try {

            const mode = 'payment';
            const line_items = checkout.products.map(p => {
                return { price: p.product.stripePriceId, quantity: p.quantity }
            });
            const session = await stripe.checkout.sessions.create({
                billing_address_collection: 'auto',
                line_items,
                mode,
                success_url: `${DOMAIN}/api/v1/checkout_success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${DOMAIN}/api/v1/checkout_cancel?session_id={CHECKOUT_SESSION_ID}`,
                //automatic_tax: {enabled: true},
            });
            checkout.sessionId = session.id;
            checkout.state = "pending";
            await checkout.save();

            return session.url;
        } catch (error) {
            console.error("Error starting checkout", error);
            throw new Error("Error starting checkout", error);
        }
    }

    /**
     * @function successCheckout
     * @description Success checkout
     * @param {String} sessionId
     * @returns {Promise<Object>}
     */
    static async successCheckout(sessionId) {
        stringValidator(sessionId, "sessionId");

        const checkout = await CheckoutModel
            .findOne({ sessionId }).populate('products.product')
        if (!checkout) ClientError.notFound("checkout not found");
        if (checkout.state !== "pending") ClientError.badRequest("a checkout can only complete if its state is 'pending'.")

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update checkout state
            checkout.state = "purchased";
            await checkout.save({ session });

            // Create user products in a transaction
            for (const product of checkout.products) {
                const params = { user: checkout.user };
                if (product.product.noOfCredits) {
                    params.credit = {
                        noOfCredits: product.product.noOfCredits,
                        creditsUsed: 0
                    };
                }

                const products = [];
                for (let i = 0; i < product.quantity; i++) {
                    products.push({ ...params });
                }

                await UserProductModel.create(products, { session, ordered: true });
            }

            // If everything is successful, commit the transaction
            await session.commitTransaction();
        } catch (error) {
            // If any error occurs, abort the transaction
            await session.abortTransaction();
            console.error("Error in checkout success transaction:", error);
            throw new Error("Error processing checkout: " + error.message);
        } finally {
            // End the session
            session.endSession();
        }
    }

    /**
     * @function cancelCheckout
     * @description Cancel checkout
     * @param {String} sessionId
     * @returns {Promise<Object>}
     */
    static async cancelCheckout(sessionId) {
        stringValidator(sessionId, "sessionId");

        const checkout = await CheckoutModel
            .findOne({ sessionId });
        if (!checkout) ClientError.notFound("checkout not found");
        if (checkout.state !== "pending") ClientError.badRequest("a checkout can only cancel if its state is 'pending'.")

        try {
            checkout.state = "open";
            await checkout.save();
        } catch (error) {
            console.error("Error cancel checkout", error);
            throw new Error("Error cancel checkout", error);
        }
    }
}
