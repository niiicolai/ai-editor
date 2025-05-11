const tool = {
    function: {
        name: "Read_File",
        "description": "Use the terminal command 'Search' to find specific content INSIDE files (like a function name or keyword). ❌ Do NOT use this to find files by name or extension — it will NOT work for things like '.css'. Instead, use 'Read_File' if you know the file path, or explore the directory state first.",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "Explain to the user why you you're reading this file or what you're looking for in it. Use a considering tone."
                },
                args: {
                    type: "string",
                    description: `Provide a JSON string with:
  - \`path\` (required): The full file path (use forward slashes)
  
  Example:
  \`\`\`json
  { "path": "C:/Users/niiic/Desktop/job-agent/app_desktop/index.js" }
  \`\`\`
  `
                }
            },
            required: ["message", "args"],
            additionalProperties: false
        },
        strict: true
    },
    type: "function"
};

const fn = {
    name: "Read_File",
    agent: {
        call: async (userArgs, gptArgs) => {
            console.log(gptArgs)
            return {
                message: gptArgs.message,
                code: "",
                clientFn: {
                    name: "Read_File",
                    args: JSON.stringify(gptArgs.args)
                }
            };
        }
    }
}

export default () => { return { tool, fn } }
