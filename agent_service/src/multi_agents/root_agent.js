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

tools.push({
    "function": {
        "name": "Search",
        "description": "you can use the terminal command 'Search' to look up content of files in the project",
        "parameters": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "why are you calling this method"
                },
                "args": {
                    "type": "string",
                    "description": "the arguments, path(required*): ensure to use forslash / e.g., pattern(required*): must be something within a file {\"path\": \"C:/Users/niiic/Desktop/job-agent/app_desktop\", \"pattern\": \"content within the file\"}"
                }
            },
            "required": ["message", "args"],
            "additionalProperties": false
        },
        "strict": true
    },
    "type": "function"
})
functions.push({
    name: "Search",
    agent: {
        call: async (userArgs, gptArgs) => {
            console.log(gptArgs)
            return {
                message: gptArgs.message,
                code: "",
                clientFn: {
                    name: "Search",
                    args: JSON.stringify(gptArgs.args)
                }
            };
        }
    }
})

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
                    console.log(`Transfer message to agent ${JSON.stringify(choice.tool_calls[0])}`)
                    const gptArgs = JSON.parse(choice.tool_calls[0].function.arguments || "{'args':''}")
                    const result = await fn.agent.call(args, gptArgs);
                    return {
                        message: result?.message || "no message",
                        code: result?.code,
                        clientFn: result?.clientFn,
                    }
                }
            }

            return { content: `No function matched: ${choice.tool_calls[0].function.name}` }
        } else {
            const data = JSON.parse(choice.content || "{}")
            return {
                message: data?.properties?.message || data?.message || "",
                code: data?.properties?.code || data?.code || "",
            }
        }
    }
}
