import * as acorn from "acorn";
import * as walk from "acorn-walk";

const operations = {
  md: {
    languages: ["javascript", "typescript"],
    execute: (
      content: string
    ): { name: string; line_start: number; line_end: number }[] => {
      try {
        const ast = acorn.parse(content, {
          ecmaVersion: "latest",
          sourceType: "module",
          locations: true,
        });
        const functions: {
          name: string;
          line_start: number;
          line_end: number;
        }[] = [];

        walk.simple(ast, {
          FunctionDeclaration(node: any) {
            if (node.id && node.id.name) {
              functions.push({
                name: node.id.name,
                line_start: node.loc.start.line,
                line_end: node.loc.end.line,
              });
            }
          },
          VariableDeclaration(node: any) {
            for (const decl of node.declarations) {
              if (
                decl.init &&
                (decl.init.type === "FunctionExpression" ||
                  decl.init.type === "ArrowFunctionExpression") &&
                decl.id &&
                decl.id.name
              ) {
                functions.push({
                  name: decl.id.name,
                  line_start: decl.loc.start.line,
                  line_end: decl.loc.end.line,
                });
              }
            }
          },
          MethodDefinition(node: any) {
            if (node.key && node.key.name) {
              functions.push({
                name: node.key.name,
                line_start: node.loc.start.line,
                line_end: node.loc.end.line,
              });
            }
          },
        });

        return functions;
      } catch {
        return [];
      }
    },
  },
} as {
  [type: string]: {
    execute: (
      content: string
    ) => { name: string; line_start: number; line_end: number }[];
    languages: string[];
  };
};

export const getFunctions = (content: string, language: string) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(language)) {
      return operation.execute(content);
    }
  }

  //console.warn(`Unable to determine dependencies based on ${name}`);
};
