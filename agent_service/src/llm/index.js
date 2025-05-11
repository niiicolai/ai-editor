import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const loadFunctions = async () => {
  const tools = [];
  const functions = [];
  const dir = path.resolve("src", "llm", "functions");
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
      console.error("ERROR: Failed to load function:", file, error);
    }
  }

  return { tools, functions };
};

const loadLlmModels = async () => {
  const models = [];
  const dir = path.resolve("src", "llm", "models");
  const files = fs.readdirSync(dir);

  for (const file of files) {
    try {
      const fileDir = path.join(dir, file);
      const filePath = pathToFileURL(fileDir);
      const module = await import(filePath.href);
      models.push(new module.default());
    } catch (error) {
      console.error("ERROR: Failed to load llm model:", file, error);
    }
  }

  return { models };
};

const { tools, functions } = await loadFunctions();
const { models } = await loadLlmModels();

export const creatChatCompletion = async (
  messages = [],
  options = {
    model: "gpt-4o-mini",
    max_tokens: 10000,
    temperature: 0.3,
    useTools: false,
  }
) => {
  for (const model of models) {

    if (model.name == options.model) {
      const response = await model.creatChatCompletion(messages, {
        max_tokens: options.max_tokens,
        temperature: options.temperature,
        tools: options.useTools ? tools : null,
      });

      if (response.tool_call) {
        const { name: callName, args: callArgs } = response.tool_call;

        for (const fn of functions) {
          if (fn.name === callName) {
            const { message, code, clientFn } = await fn.agent.call(
              messages,
              callArgs
            );

            return {
              message: message || "no message",
              code,
              clientFn,
            };
          }
        }

        return {
          message: `No function matched: ${callName}`,
        };
      } else {
        return response;
      }
    }
  }

  throw new Error("Model doesn't exist!");
};
