import { useState } from "react"
import { ProjectIndexItemClassType, ProjectIndexItemFunctionType, ProjectIndexItemVarType } from "../types/projectIndexType";

const javascriptParser = (content: string) => {
    const functions = [] as ProjectIndexItemFunctionType[];
    const classes = [] as ProjectIndexItemClassType[];
    const vars = [] as ProjectIndexItemVarType[];

    const lines = content.split("\n");

    lines.forEach((line, index) => {
        const functionMatch = line.match(/function\s+(\w+)\s*\(([^)]*)\)/);
        if (functionMatch) {
            functions.push({
                name: functionMatch[1],
                signature: functionMatch[0],
                line: index + 1,
            });
        }

        const arrowFunctionMatch = line.match(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/);
        if (arrowFunctionMatch) {
            functions.push({
                name: arrowFunctionMatch[1],
                signature: arrowFunctionMatch[0],
                line: index + 1,
            });
        }

        const classMatch = line.match(/class\s+(\w+)/);
        if (classMatch) {
            classes.push({
                name: classMatch[1],
                signature: classMatch[0],
                line: index + 1,
            });
        }

        const varMatch = line.match(/(const|let|var)\s+(\w+)/);
        if (varMatch) {
            vars.push({
                name: varMatch[2],
                signature: varMatch[0],
                line: index + 1,
            });
        }
    });

    const description = `This file contains ${functions.length} function(s), ${classes.length} class(es), and ${vars.length} variable(s).`;

    return { functions, classes, vars, description };
};

const yamlParser = (content: string) => {
    const lines = content.split("\n");
    const vars = [] as ProjectIndexItemVarType[];

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

    const description = `This YAML file contains ${vars.length} key(s).`;

    return { vars, description, functions: [], classes: [] };
};

const jsonParser = (content: string) => {
    try {
        const parsed = JSON.parse(content);
        const vars = Object.keys(parsed).map((key, index) => ({
            name: key,
            signature: `${key}: ${typeof parsed[key]}`,
            line: index + 1,
        }));

        const description = `This JSON file contains ${vars.length} key(s).`;

        return { vars, description, functions: [], classes: [] };
    } catch (error) {
        throw new Error("Invalid JSON content");
    }
};

const xmlParser = (content: string) => {
    const vars = [] as ProjectIndexItemVarType[];
    const tagRegex = /<(\w+)[^>]*>/g;
    let match;
    let line = 1;

    while ((match = tagRegex.exec(content)) !== null) {
        vars.push({
            name: match[1],
            signature: match[0],
            line,
        });

        line += content.slice(0, match.index).split("\n").length - 1;
    }

    const description = `This XML file contains ${vars.length} tag(s).`;

    return { vars, description, functions: [], classes: [] };
};

export const useParseFileContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const parse = (content:string, language: string) => {
        setIsLoading(true);
        const lines = content.split('\n').length

        try {
            switch(language) {
                case 'javascript':
                    return {
                        ...javascriptParser(content),
                        lines
                    }
                case 'yaml':
                    return {
                        ...yamlParser(content),
                        lines
                    }
                case 'json':
                    return {
                        ...jsonParser(content),
                        lines
                    }
                default:
                    return {
                        description: 'None',
                        functions: [],
                        classes: [],
                        vars: [],
                        lines
                    }
            }
        } catch (error:any) {
            console.log(error);
            setError(`Something went wrong when parsing file content: ${error.message}`)
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, error, parse };
}
