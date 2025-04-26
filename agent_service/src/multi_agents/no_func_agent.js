import OpenAIAgent from "./openai_agent.js";

export default class NoFuncAgent extends OpenAIAgent {
  constructor() {
    super({
      name: "No func Agent",
      description:
        "This is a simple agent with no functions",
      instructions:
        "You are a helpful assistant",
      model: "gpt-4o-mini",
      tools: null,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "solving-problems",
          schema: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
      max_tokens: 10000,
      temperature: 0.7,
    });
  }

  async call(args) {
    const choice = await this.prompt("user", args.content, args.messages, []);
    const data = JSON.parse(choice.content || "{}");
    return {
      message: data?.properties?.message || data?.message || "",
    };
  }
}
