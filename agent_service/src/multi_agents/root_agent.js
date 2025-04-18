import OpenAIAgent from "./openai_agent.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const loadAgents = async () => {
    const tools = [];
    const functions = [];
    const dir = path.resolve('src', 'multi_agents', 'agents');
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        try {
            const filePath = path.join(dir, file);
            const fileUrl = pathToFileURL(filePath).href;
            const agentModule = await import(fileUrl);
            const agent = new agentModule.default();

            functions.push({
                name: agent.name.replace(/\s+/, "_"),
                agent: agent
            })
            tools.push({
                "function": {
                    "name": agent.name.replace(/\s+/, "_"),
                    "description": agent.description,
                    "parameters": {
                        "type": "object",
                        "properties": {},
                        "required": [],
                        "additionalProperties": false
                    },
                    "strict": true
                }, 
                "type": "function"
            })
        } catch (error) {
            console.error('ERROR: Failed to load agent:', file, error);
        }
    }
    return { functions, tools };
};

const { tools, functions } = await loadAgents();

export default class RootAgent extends OpenAIAgent {
    constructor() {
        super({
            name: "Root Agent",
            description: "The agent responsible for orchestrating user input to the right agent.",
            instructions: "Look at the user input and select the correct tool for solving the problem",
            model: "gpt-4o-mini",
            tools,
            response_format: {
                type: "json_schema", json_schema: {
                    name: "orchestrating_user_input_to_the_right_agent",
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
            parameters: null,
            max_tokens: 10000,
            temperature: 0.7
        })
    }

    async call(args) {
        const choice = await this.prompt("user", args.content, args.messages, [])
        if (choice.tool_calls?.length) {

            for (const fn of functions) {
                if (fn.name === choice.tool_calls[0].function.name) {
                    console.log(`Transfer message to agent ${fn.name}`)
                    const result = await fn.agent.call(args);
                    return {
                        message: result?.message || "no message",
                        code: result?.code,
                        markdown: result?.markdown,
                    }
                }
            }

            return { content: `No function matched: ${choice.tool_calls[0].function.name}` }
        } else {
            const data = JSON.parse(choice.content || "{}")
            return {
                message: data?.properties?.message || data?.message || "",
                code: data?.properties?.code || data?.code || "",
                markdown: data?.properties?.markdown || data?.markdown || ""
            }
        }
    }
}
