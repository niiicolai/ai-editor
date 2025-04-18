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
        parameters: null,
        response_format: null,
        max_tokens: 10000,
        temperature: 0.3
    }) {
        super(options);
        this.tools = options.tools;
        this.parameters = options.parameters;
        this.response_format = options.response_format;
        this.max_tokens = options.max_tokens;
        this.temperature = options.temperature;
    }

    async call(args) {
        throw new Error("Not implemented");
    }

    async prompt(role, content, messages, developerMessages) {
        console.log({ role: "developer", content: `YOU MUST FOLLOW THESE INSTRUCTIONS: ${this.instructions}` })
        const response = await openai.chat.completions.create({
            model: this.model,
            messages: [
                ...messages.map(m => {
                    return { role: m.role, content: m.content }
                }),
                ...developerMessages.map(m => {
                    return { role: m.role, content: m.content }
                }),
                { role: "developer", content: `YOU MUST RETURN DATA IN THE CORRECT RESPONSE FORMAT` },
                { role: "developer", content: `YOU MUST FOLLOW THESE INSTRUCTIONS: ${this.instructions}` },
                { role: "developer", content: `REMEMBER TO TRANSFER INPUT TO OTHER AGENTS IF THEIR DESCRIPTION PROVIDES IT` },
                { role, content },
            ],
            response_format: this.response_format,
            max_tokens: this.max_tokens,
            temperature: this.temperature,
            tools: this.tools
        });
        console.log(response.choices[0].message)
        return response.choices[0].message;
    }
}
