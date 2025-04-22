const tool = {
    function: {
        name: "Search_File_Content",
        description: "Use the terminal command 'Search' to find **specific content inside files**. This command searches the text _within_ files — not filenames or extensions. If you don't know which file might contain the content you're looking for, this is a good choice.",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "Explain to the user why you this search is needed or what you hope to find. Use a considering tone."
                },
                args: {
                    type: "string",
                    description: `Provide a JSON string with:
  - \`path\` (required): The directory path to search in (use forward slashes)
  - \`pattern\` (required): The text to search for **inside** files.
  
  Example:
  \`\`\`json
  { "path": "C:/Users/niiic/Desktop/job-agent/app_desktop", "pattern": "function handleSubmit" }
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
    name: "Search_File_Content",
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
}

export default () => { return { tool, fn } }
