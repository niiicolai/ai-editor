import * as acorn from "acorn";
import * as walk from "acorn-walk";

const operations = {
  md: {
    languages: ["javascript", "typescript"],
    execute: (content: string): { name: string; line: number }[] => {
      try {
        const ast = acorn.parse(content, {
          ecmaVersion: "latest",
          sourceType: "module",
          locations: true,
        });
        const variables: { name: string; line: number }[] = [];

        walk.simple(ast, {
          VariableDeclarator(node: any) {
            if (node.id && node.id.name) {
              variables.push({
                name: node.id.name,
                line: node.loc.start.line,
              });
            }
          },
          FunctionDeclaration(node: any) {
            if (node.id && node.id.name) {
              variables.push({
                name: node.id.name,
                line: node.loc.start.line,
              });
            }
          },
          ClassDeclaration(node: any) {
            if (node.id && node.id.name) {
              variables.push({
                name: node.id.name,
                line: node.loc.start.line,
              });
            }
          },
        });

        return variables;
      } catch {
        return [];
      }
    },
  },
} as {
  [type: string]: {
    execute: (content: string) => { name: string; line: number }[];
    languages: string[];
  };
};

export const getVariables = (content: string, language: string) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(language)) {
      return operation.execute(content);
    }
  }

  //console.warn(`Unable to determine dependencies based on ${name}`);
};
