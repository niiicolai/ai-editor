import * as acorn from "acorn";
import * as walk from "acorn-walk";

const operations = {
    md: {
        languages: ["javascript", "typescript"],
        execute: (
            content: string
        ): { name: string; signature: string; line_start: number; line_end: number }[] => {
            try {
                const ast = acorn.parse(content, {
                    ecmaVersion: "latest",
                    sourceType: "module",
                    locations: true,
                });
                const functionCalls: {
                    name: string;
                    signature: string;
                    line_start: number;
                    line_end: number;
                }[] = [];

                walk.simple(ast, {
                    CallExpression(node: any) {
                        let callName = "";
                        if (node.callee.type === "Identifier") {
                            callName = node.callee.name;
                        } else if (node.callee.type === "MemberExpression") {
                            const object = node.callee.object;
                            const property = node.callee.property;
                            const objectName = object.type === "Identifier" ? object.name : "";
                            const propertyName =
                                property.type === "Identifier" ? property.name : "";
                            callName =
                                objectName && propertyName
                                    ? `${objectName}.${propertyName}`
                                    : "";
                        }
                        if (callName) {
                            // Build the signature: name(arg1, arg2, ...)
                            const args = node.arguments
                                .map((arg: any) => {
                                    if (arg.type === "Identifier") return arg.name;
                                    if (arg.type === "Literal") return JSON.stringify(arg.value);
                                    if (arg.type === "ObjectExpression") return "{...}";
                                    if (arg.type === "ArrayExpression") return "[...]";
                                    return "...";
                                })
                                .join(", ");
                            const signature = `${callName}(${args})`;

                            functionCalls.push({
                                name: callName,
                                signature,
                                line_start: node.loc.start.line,
                                line_end: node.loc.end.line,
                            });
                        }
                    },
                } as walk.SimpleVisitors<any>);

                return functionCalls;
            } catch {
                return [];
            }
        },
    },
} as {
    [type: string]: {
        execute: (
            content: string
        ) => { name: string; signature: string; line_start: number; line_end: number }[];
        languages: string[];
    };
};

export const getFunctionCalls = (content: string, language: string) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(language)) {
      return operation.execute(content);
    }
  }

  //console.warn(`Unable to determine dependencies based on ${name}`);
};
