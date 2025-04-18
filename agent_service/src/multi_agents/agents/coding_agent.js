import OpenAIAgent from "../openai_agent.js";

export default class CodingAgent extends OpenAIAgent {
    constructor() {
        super({
            name: "Coding Agent",
            description: "The agent responsible for coding.",
            instructions: "I HANDLE EVERYTHING CODING RELATED",
            model: "gpt-4o-mini",
            tools: [],
            response_format: {
                type: "json_schema", json_schema: {
                    name: "code_update",
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            code: { type: "string" },
                            markdown: { type: "string" },
                        }
                    }
                }
            },
            parameters: JSON.stringify({ required: ["prompt"]}),
            max_tokens: 10000,
            temperature: 0.7
        })
    }

    async call(args) {
        const choice = await super.prompt("user", args.content, args.messages, [])
        const data = JSON.parse(choice.content || "{}")
        console.log(data)
        return {
            message: data?.properties?.message || data?.message || "",
            code: data?.properties?.code || data?.code || "",
            markdown: data?.properties?.markdown || data?.markdown || ""
        }
    }
}
