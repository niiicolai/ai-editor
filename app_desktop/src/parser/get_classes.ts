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
        const classes: {
          name: string;
          line_start: number;
          line_end: number;
        }[] = [];

        walk.simple(ast, {
          ClassDeclaration(node: any) {
            classes.push({
              name: node.id?.name || "<anonymous>",
              line_start: node.loc.start.line,
              line_end: node.loc.end.line,
            });
          },
        });
        return classes;
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

export const getClasses = (content: string, language: string) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(language)) {
      return operation.execute(content);
    }
  }

  //console.warn(`Unable to determine dependencies based on ${name}`);
};
