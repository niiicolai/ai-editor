import { creatChatCompletion } from "../llm/index.js";
import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import OpenAI from "openai";
import LlmUsageService from "./llm_usage_service.js";
import AvailableLlmService from "./available_llm_service.js";
import UserModel from "../mongodb/models/user_model.js";
import Decimal from "decimal.js";
import ClientError from "../errors/client_error.js";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) console.error("OPENAI_API_KEY is not set");

const openai = new OpenAI({ apiKey });

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
      // This is to avoiding spamming the LLM in test if someone forgets to mock the request.
      const response =
        process.NODE_ENV === "test"
          ? { content: { 
                choices: [{ message: "test message"}], 
                usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 } 
            }}
          : await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: body.messages,
        max_tokens: 10000,
        temperature: 0.7,
        ...(body.response_format && { response_format: body.response_format }),
      });

      const choice = response.choices[0].message;
      const content = choice.content;

      await LlmUsageService.create(
        {
          llm: llm._id.toString(),
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens,
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
