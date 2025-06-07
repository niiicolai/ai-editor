import { Type } from '@google/genai';

const name = "Read_File";
const description = "Use the terminal command 'Search' to find specific content INSIDE files (like a function name or keyword). ❌ Do NOT use this to find files by name or extension — it will NOT work for things like '.css'. Instead, use 'Read_File' if you know the file path, or explore the directory state first.";
const message = {
    description: "Explain to the user why you you're reading this file or what you're looking for in it. Use a considering tone."
}
const args = {
    description: `Provide a JSON string with:
  - \`path\` (required): The full file path (use forward slashes)
  
  Example:
  \`\`\`json
  { "path": "C:/Users/niiic/Desktop/job-agent/app_desktop/index.js" }
  \`\`\`
  `
}
const required = ["message", "args"];

const toolOpenai = {
    function: {
        name,
        description,
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: message.description
                },
                args: {
                    type: "string",
                    description: args.description
                }
            },
            required,
            additionalProperties: false
        },
        strict: true
    },
    type: "function"
};

const toolGoogle = {
  name,
  description,
  parameters: {
    type: Type.OBJECT,
    properties: {
      message: {
        type: Type.STRING,
        description: message.description,
      },
      args: {
        type: Type.STRING,
        description: args.description,
      },
    },
    required,
  },
};

const fn = {
    name,
    agent: {
        call: async (userArgs, gptArgs) => {

            return {
                message: gptArgs.message,
                code: "",
                clientFn: {
                    name,
                    args: gptArgs.args
                }
            };
        }
    }
}

export default () => { return { toolOpenai, toolGoogle, fn } }
