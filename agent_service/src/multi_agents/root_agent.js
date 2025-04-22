import OpenAIAgent from "./openai_agent.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const loadFunctions = async () => {
    const tools = [];
    const functions = [];
    const dir = path.resolve('src', 'multi_agents', 'functions');
    const files = fs.readdirSync(dir);

    for (const file of files) {
        try {
            const fileDir = path.join(dir, file);
            const filePath = pathToFileURL(fileDir);
            const module = await import(filePath.href);
            const { fn, tool } = module.default();
            tools.push(tool);
            functions.push(fn);
        } catch (error) {
            console.error('ERROR: Failed to load function:', file, error);
        }
    }

    return { tools, functions };
};

const { tools, functions } = await loadFunctions();

export default class RootAgent extends OpenAIAgent {
    constructor() {
        super({
            name: "Root Agent",
            description: "This agent acts as the central router that interprets user input and delegates tasks to the most appropriate tool or agent.",
            instructions: "Carefully analyze the user's intent and context. Choose the most relevant tool or agent that can effectively solve the task. Prioritize accuracy and avoid guessing. If the task requires finding file types, prefer using directory state tools. Use content-based tools like 'Search_File_Content' only when the user is looking for specific text inside files. Do not route commands to tools that are not meant for the task.",
            model: "gpt-4o-mini",
            tools,
            response_format: {
                type: "json_schema", json_schema: {
                    name: "solving-problems",
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            code: { type: "string" },
                        }
                    }
                }
            },
            max_tokens: 10000,
            temperature: 0.7
        })
    }

    async call(args) {
        const choice = await this.prompt("user", args.content, args.messages, [])
        if (choice.tool_calls?.length) {

            for (const fn of functions) {
                if (fn.name === choice.tool_calls[0].function.name) {
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
