const tool = {
    function: {
        name: "List_Directory",
        description: "Use the terminal command 'List_Directory' to list all files and folders inside a given directory. This is useful for exploring project structure, checking file types (like .js or .css), and locating specific filenames. ❌ Do NOT use this to search for content inside files — use 'Search' for that.",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "Explain to the user why you want to list this directory. Use a considering tone."
                },
                args: {
                    type: "string",
                    description: `Provide a JSON string with:
      - \`path\` (required): The full path of the folder to list (use forward slashes)
      
      Example:
      \`\`\`json
      {
        "path": "C:/Users/niiic/Desktop/job-agent/app_desktop"
      }
      \`\`\`
      
      You will receive a list of file and folder paths (excluding node_modules).`
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
    name: "List_Directory",
    agent: {
        call: async (userArgs, gptArgs) => {
            console.log(gptArgs)
            return {
                message: gptArgs.message,
                code: "",
                clientFn: {
                    name: "List_Directory",
                    args: JSON.stringify(gptArgs.args)
                }
            };
        }
    }
}

export default () => { return { tool, fn } }
