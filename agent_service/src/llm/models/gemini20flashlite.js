import { GoogleGenAI, Type } from "@google/genai";
import { Model } from "../model.js";

const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) console.error("GOOGLE_AI_API_KEY is not set");

const ai = new GoogleGenAI({ apiKey });

export default class Gemini20FlashLite extends Model {
  constructor() {
    super("gemini-2.0-flash-lite");
  }

  async creatChatCompletion(
    messages = [],
    options = {
      max_tokens: 10000,
      temperature: 0.3,
      tools: null,
    }
  ) {
    const { max_tokens: maxOutputTokens, temperature, tools } = options;

    if (!messages || !messages.length)
      throw new Error("At least one message is required");
    const input = messages.pop();

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        { role: 'user', parts: [{ text: 'act as a helpful code assistant' }], },
        ...messages.map((m) => {
          return {
            role: m.role === 'assistant' ? 'model' : m.role,
            parts: [{ text: m.content }],
          };
        }),
      ],
      config: {
        maxOutputTokens,
        temperature,
        ...(!tools?.toolsGoogle && {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: {
                type: Type.STRING,
              },
              code: {
                type: Type.STRING,
              },
            },
          },
        }),
        tools: tools?.toolsGoogle
          ? [{ functionDeclarations: tools.toolsGoogle }]
          : undefined,
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY", // Required when using functionDeclarations
          },
        },
      },
    });
    const response = await chat.sendMessage({
      message: input.content,
    });

    const usage = {
      prompt_tokens: response.usageMetadata.promptTokenCount,
      completion_tokens: response.usageMetadata.candidatesTokenCount,
      total_tokens: response.usageMetadata.totalTokenCount,
    };

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0];
      const callName = functionCall.name;
      const callArgs = functionCall.args;
      return {
        usage,
        tool_call: { name: callName, args: callArgs },
      };
    } else {
      try {
        const data = JSON.parse(response.text || "{}");
        const content = {
          message: data?.properties?.message || data?.message || "",
          code: data?.properties?.code || data?.code || "",
        };
        return {
          usage,
          content,
        };
      } catch {
        return {
          usage,
          content: response.text,
        };
      }
    }
  }
}
