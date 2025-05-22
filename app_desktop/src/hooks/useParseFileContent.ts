import { useState } from "react";
import {
  ProjectIndexItemClassType,
  ProjectIndexItemFunctionType,
  ProjectIndexItemVarType,
} from "../types/projectIndexType";
import * as acorn from "acorn";

export const javascriptParser = (content: string) => {
  const functions: ProjectIndexItemFunctionType[] = [];
  const classes: ProjectIndexItemClassType[] = [];
  const vars: ProjectIndexItemVarType[] = [];
  const comments: { line: number; text: string }[] = [];
  let syntaxError: string | null = null;

  let ast: any = null;
  try {
    // @ts-ignore
    ast = acorn.parse(content, {
      ecmaVersion: "latest",
      locations: true,
      sourceType: "module",
      allowHashBang: true,
    });
  } catch (err: any) {
    syntaxError = err.message ?? "Syntax error detected";
  }

  // Extract comments using regex (acorn doesn't extract comments by default)
  const commentRegex = /\/\/(.*)|\/\*([\s\S]*?)\*\//g;
  let match;
  while ((match = commentRegex.exec(content)) !== null) {
    const start = match.index;
    const line = content.slice(0, start).split("\n").length;
    const commentText =
      match[1] !== undefined ? match[1].trim() : match[2].trim();
    comments.push({ line, text: commentText });
  }

  // Traverse AST for functions, classes, and vars
  function walk(node: any) {
    if (!node) return;
    const line = node.loc?.start.line ?? 1;
    const textLine = content.split("\n")[line - 1]?.trim();

    switch (node.type) {
      case "FunctionDeclaration":
        if (node.id && node.id.name) {
          functions.push({ name: node.id.name, line, signature: textLine });
        }
        break;
      case "ClassDeclaration":
        if (node.id && node.id.name) {
          classes.push({ name: node.id.name, line, signature: textLine });
        }
        break;
      case "VariableDeclaration":
        node.declarations.forEach((decl: any) => {
          if (decl.id && decl.id.name) {
            vars.push({ name: decl.id.name, line, signature: textLine });
          }
        });
        break;
    }

    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const child = node[key];
        if (Array.isArray(child)) {
          child.forEach(walk);
        } else if (child && typeof child.type === "string") {
          walk(child);
        }
      }
    }
  }

  if (ast && !syntaxError) {
    walk(ast);
  }

  const words = content
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const uniqueKeywords = Array.from(new Set(words)).slice(0, 15);

  const description =
    `This file contains ${functions.length} function(s), ${
      classes.length
    } class(es), ${vars.length} variable(s), ${
      comments.length
    } comment(s). This is random words from the file: ${uniqueKeywords.join(
      ", "
    )}.` + (syntaxError ? ` Syntax error: ${syntaxError}` : "");

  return { functions, classes, vars, comments, description, syntaxError };
};

const yamlParser = (content: string) => {
  const lines = content.split("\n");
  const vars = [] as ProjectIndexItemVarType[];
  let syntaxError: string | null = null;

  try {
    // Simple YAML validation: try parsing with JSON after conversion
    // (not robust, but catches some syntax errors)
    // Replace tabs with spaces, remove comments, and try to parse as JSON
    const jsonLike = lines
      .filter((line) => !line.trim().startsWith("#"))
      .map((line) => line.replace(/^(\s*)(\w+):/, '$1"$2":'))
      .join("\n");
    JSON.parse(`{${jsonLike}}`);
  } catch (err: any) {
    syntaxError = err.message || "Syntax error detected";
  }

  lines.forEach((line, index) => {
    const match = line.match(/^(\w+):/);
    if (match) {
      vars.push({
        name: match[1],
        signature: match[0],
        line: index + 1,
      });
    }
  });

  const description =
    `This YAML file contains ${vars.length} key(s).` +
    (syntaxError ? ` Syntax error: ${syntaxError}` : "");

  return {
    vars,
    description,
    functions: [],
    classes: [],
    comments: [],
    syntaxError,
  };
};

const jsonParser = (content: string) => {
  let syntaxError: string | null = null;
  let vars: ProjectIndexItemVarType[] = [];
  try {
    const parsed = JSON.parse(content);
    vars = Object.keys(parsed).map((key, index) => ({
      name: key,
      signature: `${key}: ${typeof parsed[key]}`,
      line: index + 1,
    }));
  } catch (error: any) {
    syntaxError = error.message || "Invalid JSON content";
  }

  const description =
    `This JSON file contains ${vars.length} key(s).` +
    (syntaxError ? ` Syntax error: ${syntaxError}` : "");

  return {
    vars,
    description,
    functions: [],
    classes: [],
    comments: [],
    syntaxError,
  };
};

const xmlParser = (content: string) => {
  const vars = [] as ProjectIndexItemVarType[];
  const tagRegex = /<(\w+)[^>]*>/g;
  let match;
  let line = 1;
  let syntaxError: string | null = null;

  try {
    // Try parsing with DOMParser if available, otherwise fallback to regex
    // In Node.js, this will throw, so just catch and ignore
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "application/xml");
      const parserError = doc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
        syntaxError = parserError[0].textContent || "Syntax error detected";
      }
    } else {
      // Simple check for unclosed tags
      const openTags = (content.match(/<(\w+)/g) || []).length;
      const closeTags = (content.match(/<\/(\w+)>/g) || []).length;
      if (openTags !== closeTags) {
        syntaxError = "Mismatched XML tags";
      }
    }
  } catch (err: any) {
    syntaxError = err.message || "Syntax error detected";
  }

  while ((match = tagRegex.exec(content)) !== null) {
    vars.push({
      name: match[1],
      signature: match[0],
      line,
    });

    line += content.slice(0, match.index).split("\n").length - 1;
  }

  const description =
    `This XML file contains ${vars.length} tag(s).` +
    (syntaxError ? ` Syntax error: ${syntaxError}` : "");

  return {
    vars,
    description,
    functions: [],
    classes: [],
    comments: [],
    syntaxError,
  };
};

const plaintextParser = (content: string) => {
  const linesArr = content.split("\n");
  const lines = linesArr.length;
  // Extract up to 15 unique keywords (words longer than 2 chars, ignoring duplicates)
  const words = content
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const uniqueKeywords = Array.from(new Set(words)).slice(0, 15);
  const description = `This plaintext file contains ${lines} line(s) and keywords: ${uniqueKeywords.join(
    ", "
  )}.`;
  return {
    description,
    functions: [],
    classes: [],
    vars: [],
    comments: [],
    syntaxError: "",
  };
};

export const useParseFileContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const parse = (content: string, language: string) => {
    setIsLoading(true);
    const lines = content.split("\n").length;

    try {
      switch (language) {
        case "javascript":
          return {
            ...javascriptParser(content),
            lines,
          };
        case "typescript":
          return {
            ...javascriptParser(content),
            lines,
          };
        case "plaintext":
          return {
            ...plaintextParser(content),
            lines,
          };
        case "markdown":
          return {
            ...plaintextParser(content),
            lines,
          };
        case "yaml":
          return {
            ...yamlParser(content),
            lines,
          };
        case "xml":
          return {
            ...xmlParser(content),
            lines,
          };
        case "json":
          return {
            ...jsonParser(content),
            lines,
          };
        default:
          const words = content
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter((word) => word.length > 2);
          const uniqueKeywords = Array.from(new Set(words)).slice(0, 15);
          const description = `This file contains ${lines} line(s) and keywords: ${uniqueKeywords.join(
            ", "
          )}.`;
          return {
            description,
            syntaxError: "",
            functions: [],
            classes: [],
            vars: [],
            comments: [],
            lines,
          };
      }
    } catch (error: any) {
      console.log(error);
      setError(
        `Something went wrong when parsing file content: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, parse };
};
