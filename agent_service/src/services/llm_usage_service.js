import LlmUsageModel from "../mongodb/models/llm_usage_model.js";
import UserModel from "../mongodb/models/user_model.js";
import AvailableLlmModel from "../mongodb/models/available_llm_model.js";
import dto from "../dto/llm_usage_dto.js";
import ClientError from '../errors/clientError.js';
import Decimal from 'decimal.js'
import mongoose from "mongoose";

import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";
import { numberValidator } from "../validators/number_validator.js";

const ONE_CREDIT_TO_DOLLAR = parseFloat(process.env.ONE_CREDIT_TO_DOLLAR || '0');
if (ONE_CREDIT_TO_DOLLAR <= 0) console.error("ONE_CREDIT_TO_DOLLAR not set in .env or is less or equal to zero");

const allowedFields = [
    "_id",
    "llm",
    "user",
    "event",
    "user_agent_session_messages",
    "context_user_agent_session_messages",
    "credit_to_dollars_at_purchase",
    "cost_per_input_token_at_purchase",
    "cost_per_output_token_at_purchase",
    "fee_per_input_token_at_purchase",
    "fee_per_output_token_at_purchase",
    "cost_per_cached_input_token_at_purchase",
    "total_cost_in_dollars",
    "prompt_tokens",
    "completion_tokens",
    "total_tokens",
    "credit_cost",
    "created_at",
    "updated_at",
];

export default class LlmUsageService {

    /**
     * @function find
     * @description Find llm usage by id
     * @param {string} _id - llm usage id
     * @param {string} userId - User id
     * @param {array} fields - Fields to return
     * @return {Promise<object>} - llm usage object
     */
    static async find(_id, userId, fields = null) {
        idValidator(_id, "_id");
        idValidator(userId, "userId");
        fields = fieldsValidator(fields, allowedFields);

        const llmUsage = await LlmUsageModel
            .findOne({ _id, user: userId })
            .select(fields)
            .populate('llm user_agent_session_messages context_user_agent_session_messages');
        if (!llmUsage) ClientError.notFound("LLM usage not found");

        return dto(llmUsage);
    }

    /**
     * @function findAll
     * @description Find all llm usages by user id
     * @param {number} page - Page number
     * @param {number} limit - Page size
     * @param {string} userId - User id
     * @param {array} fields - Fields to return
     * @return {Promise<object>} - User agent session objects
     */
    static async findAll(page, limit, userId, fields = null) {
        paginatorValidator(page, limit);
        idValidator(userId, "userId");
        fields = fieldsValidator(fields, allowedFields);

        const query = { user: userId };
        const llmUsages = await LlmUsageModel
            .find(query)
            .select(fields)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 })
            .populate('llm user_agent_session_messages context_user_agent_session_messages');
        const total = await LlmUsageModel.countDocuments(query);
        const pages = Math.ceil(total / limit);

        return {
            usages: llmUsages.map(dto),
            page,
            limit,
            total,
            pages,
        };
    }

    /**
     * @function create
     * @description Create a llm usage
     * @param {object} body - Request body
     * @param {string} userId - User id
     * @param {array} fields - Fields to return
     * @return {Promise<object>} - Created llm usage object
     */
    static async create(body, userId, fields = null) {
        const { prompt_tokens, completion_tokens, total_tokens } = body;

        objectValidator(body, "body");
        stringValidator(body.llm, "llm");
        stringValidator(body.event, "event")
        numberValidator(prompt_tokens, "prompt_tokens");
        numberValidator(completion_tokens, "completion_tokens");
        numberValidator(total_tokens, "total_tokens");
        idValidator(userId, "userId");

        const user = await UserModel.findOne({ _id: userId });
        if (!user) ClientError.notFound("user not found");

        const llm = await AvailableLlmModel.findOne({ _id: body.llm });
        if (!llm) ClientError.notFound("LLM not found");
        
        /**
         * The cost is the provider's cost of using the LLM.
         * The fee is what this service charges on top of the provider's cost.
         * These values are used to calculate the total cost of the LLM usage.
         */
        const costPerInputToken = new Decimal(llm.cost_per_input_token);
        const feePerInputToken = new Decimal(llm.fee_per_input_token);
        const costPerOutputToken = new Decimal(llm.cost_per_output_token);
        const feePerOutputToken = new Decimal(llm.fee_per_output_token);
        const costPerCachedInputToken = new Decimal(llm.cost_per_cached_input_token);

        const totalCostInputTokens = costPerInputToken.plus(feePerInputToken).times(prompt_tokens);
        const totalCostOutputTokens = costPerOutputToken.plus(feePerOutputToken).times(completion_tokens);
        
        const totalCostInDollars = totalCostInputTokens.plus(totalCostOutputTokens);
        const costPerCreditInDollars = new Decimal(ONE_CREDIT_TO_DOLLAR);

        const credit_cost = totalCostInDollars.dividedBy(costPerCreditInDollars);
        const new_user_credit = new Decimal(user.credit).minus(credit_cost);

        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const llmUsage = new LlmUsageModel({
                llm: body.llm,
                user_agent_session_messages: body.messages,
                context_user_agent_session_messages: body.context_messages,
                event: body.event,
                total_cost_in_dollars: totalCostInDollars,
                credit_to_dollars_at_purchase: costPerCreditInDollars,
                cost_per_input_token_at_purchase: costPerInputToken,
                cost_per_output_token_at_purchase: costPerOutputToken,
                fee_per_input_token_at_purchase: feePerInputToken,
                fee_per_output_token_at_purchase: feePerOutputToken,
                cost_per_cached_input_token_at_purchase: costPerCachedInputToken,
                prompt_tokens: body.prompt_tokens,
                completion_tokens: body.completion_tokens,
                total_tokens: body.total_tokens,
                user: user._id,
                credit_cost,
            });
            await llmUsage.save();

            user.credit = new_user_credit;
            await user.save({ session });
            await session.commitTransaction();
            
            return await this.find(llmUsage._id.toString(), userId, fields)
        } catch (error) {
            await session.abortTransaction();
            console.error("Error creating LLM usage", error);
            throw new Error("Error creating LLM usage", error);
        } finally {
            await session.endSession();
        }
    }

    /**
     * @function destroy
     * @description Delete llm usage by id
     * @param {string} _id - llm usage id
     * @param {string} userId - User id
     * @return {Promise<void>}
     */
    static async destroy(_id, userId) {
        idValidator(_id, "_id");
        idValidator(userId, "userId");

        const llmUsage = await LlmUsageModel.findOne({ _id, user: userId });
        if (!llmUsage) ClientError.notFound("LLM usage not found");

        try {
            await LlmUsageModel.deleteOne({ _id });
        } catch (error) {
            throw new Error("Error deleting LLM usage", error);
        }
    }
}
