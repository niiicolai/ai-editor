import OpenAI from "openai";
import { Model } from "../model.js";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) console.error("OPENAI_API_KEY is not set");

const openai = new OpenAI({ apiKey });

export default class Gpt4oMini extends Model {
  constructor() {
    super("gpt-4o-mini");
  }

  async creatChatCompletion(
    messages = [],
    options = {
      max_tokens: 10000,
      temperature: 0.3,
      tools: null,
    }
  ) {
    const { max_tokens, temperature, tools } = options;
    const response = await openai.chat.completions.create({
      model: this.name,
      messages,
      max_tokens,
      temperature,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "response_format",
          schema: {
            type: "object",
            properties: {
              message: { type: "string" },
              code: { type: "string" },
            },
          },
        },
      },
      ...(tools && { tools }),
    });

    const choice = response.choices[0].message;
    const usage = {
      prompt_tokens: response.usage.prompt_tokens,
      completion_tokens: response.usage.completion_tokens,
      total_tokens: response.usage.total_tokens,
    };

    if (choice.tool_calls?.length) {
      const callName = choice.tool_calls[0].function.name;
      const callArgs = JSON.parse(
        choice.tool_calls[0].function.arguments || "{'args':''}"
      );
      return {
        usage,
        tool_call: { name: callName, args: callArgs }
      };
    } else {
      const data = JSON.parse(choice.content || "{}");
      const content = {
        message: data?.properties?.message || data?.message || "",
        code: data?.properties?.code || data?.code || "",
      };

      return {
        usage,
        content,
      };
    }
  }
}
