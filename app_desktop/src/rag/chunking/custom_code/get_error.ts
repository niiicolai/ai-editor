import * as acorn from "acorn";
import YAML from 'yaml';

const operations = {
  js: {
    languages: ["javascript", "typescript"],
    execute: (content: string) => {
      try {
        // @ts-ignore
        acorn.parse(content, {
          ecmaVersion: "latest",
          locations: true,
          sourceType: "module",
          allowHashBang: true,
        });
      } catch (err: any) {
        return err.message ?? "Error detected";
      }
    },
  },
  json: {
    languages: ["json"],
    execute: (content: string) => {
      try {
        JSON.parse(content);
      } catch (err: any) {
        return err.message ?? "Error detected";
      }
    },
  },
  xml: {
    languages: ["xml"],
    execute: (content: string) => {
      try {
        new DOMParser().parseFromString(content, "application/xml");
        const parserError = /<parsererror/i.test(content)
          ? "Invalid XML"
          : undefined;
        if (parserError) throw new Error(parserError);
      } catch (err: any) {
        return err.message ?? "Error detected";
      }
    },
  },
  yaml: {
    languages: ["yaml"],
    execute: (content: string) => {
      try {
        YAML.parse(content)
      } catch (err: any) {
        return err.message ?? "Error detected";
      }
    },
  },
  html: {
    languages: ["html"],
    execute: (content: string) => {
      try {
        const doc = new DOMParser().parseFromString(content, "text/html");
        // Check for <parsererror> in the parsed document (not standard in HTML, but for consistency)
        const parserError = doc.querySelector("parsererror");
        if (parserError) throw new Error("Invalid HTML");
        // Optionally, check if the document is empty or has no elements
        if (!doc.documentElement || !doc.body) throw new Error("Invalid HTML structure");
      } catch (err: any) {
        return err.message ?? "Error detected";
      }
    },
  }
} as {
  [type: string]: {
    execute: (content: string) => string | undefined;
    languages: string[];
  };
};

export const getError = (name: string, content: string, language: string) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(language)) {
      return operation.execute(content) ?? null;
    }
  }

  console.warn(`Couldn't determine errors of ${name}`);
  return null;
};
