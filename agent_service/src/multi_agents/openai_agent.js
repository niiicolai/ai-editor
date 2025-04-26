import Agent from "./agent.js";
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) console.error("OPENAI_API_KEY is not set");

const openai = new OpenAI({ apiKey });

export default class OpenAIAgent extends Agent {
    constructor(options = { 
        name: null, 
        description: null, 
        instructions: null, 
        model: null,
        tools: null, 
        response_format: null,
        max_tokens: 10000,
        temperature: 0.3
    }) {
        super(options);
        this.tools = options.tools;
        this.response_format = options.response_format;
        this.max_tokens = options.max_tokens;
        this.temperature = options.temperature;
    }

    async call(args) {
        throw new Error("Not implemented");
    }

    async prompt(role, content, messages, developerMessages) {
        const response = await openai.chat.completions.create({
            model: this.model,
            messages: [
                ...messages.map(m => {
                    return { role: m.role, content: m.content }
                }),
                ...developerMessages.map(m => {
                    return { role: m.role, content: m.content }
                }),
                { role: "developer", content: `Always use tools when you are searching for answer for a goal` },
                { role: "developer", content: `Use function results to give the user answer on their goal` },
                { role: "developer", content: `Always mention your goal in your messages` },
                { role: "developer", content: `Please, use the message field for short responses` },
                { role: "developer", content: `YOU MUST RETURN DATA IN THE CORRECT RESPONSE FORMAT` },
                { role: "developer", content: `YOU MUST FOLLOW THESE INSTRUCTIONS: ${this.instructions}` },
                { role, content },
            ],
            response_format: this.response_format,
            max_tokens: this.max_tokens,
            temperature: this.temperature,
            ...(this.tools && { tools: this.tools })
        });
        return response.choices[0].message;
    }
}
