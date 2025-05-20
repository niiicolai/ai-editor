import { creatChatCompletion } from "../llm/index.js";
import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import LlmUsageService from "./llm_usage_service.js";
import AvailableLlmService from "./available_llm_service.js";
import UserModel from "../mongodb/models/user_model.js";
import Decimal from "decimal.js";
import ClientError from "../errors/client_error.js";

export default class LlmService {
  static async createMessage(body, userId) {
    objectValidator(body);
    stringValidator(body.event, "body.event");
    if (!body.messages) ClientError.badRequest("body.messages is required");
    if (body.event === "ask" || body.event === "agent") {
      ClientError.badRequest(
        "'ask' and 'agent' are reserved events. Pick somthing else."
      );
    }

    const user = await UserModel.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    const user_credit = new Decimal(user.credit);
    if (user_credit.isZero() || user_credit.isNegative()) {
      ClientError.badRequest("insufficient credits");
    }

    const model = body.selected_llm ?? "gpt-4o-mini";
    const llm = await AvailableLlmService.findByName(model);
    if (!llm) ClientError.notFound("LLM not found");

    try {
      const { content, usage } = await creatChatCompletion(body.messages, {
        model,
        max_tokens: 10000,
        temperature: 0.7,
        useTools: false,
      });

      await LlmUsageService.create(
        {
          llm: llm._id.toString(),
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
          messages: [],
          context_messages: [],
          event: body.event,
        },
        userId
      );

      return { content };
    } catch (error) {
      console.error("Error creating LLM message", error);
      throw new Error("Error creating LLM message", error);
    }
  }
}
