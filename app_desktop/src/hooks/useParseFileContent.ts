import { useState } from "react"
import { ProjectIndexItemClassType, ProjectIndexItemFunctionType, ProjectIndexItemVarType } from "../types/projectIndexType";

const javascriptParser = (content: string) => {
    const functions: ProjectIndexItemFunctionType[] = [];
    const classes: ProjectIndexItemClassType[] = [];
    const vars: ProjectIndexItemVarType[] = [];
    const comments: { line: number; text: string }[] = [];

    const lines = content.split("\n");

    const seenFunctions = new Set<string>();
    let inMultilineComment = false;
    let multilineBuffer = '';
    let multilineStartLine = 0;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Multi-line comment start
        if (!inMultilineComment && trimmedLine.startsWith("/*")) {
            inMultilineComment = true;
            multilineBuffer = trimmedLine;
            multilineStartLine = index + 1;

            // Handle one-liner /* ... */
            if (trimmedLine.includes("*/")) {
                comments.push({ line: multilineStartLine, text: multilineBuffer });
                inMultilineComment = false;
                multilineBuffer = '';
            }
            return;
        }

        // Multi-line comment continuation
        if (inMultilineComment) {
            multilineBuffer += "\n" + trimmedLine;
            if (trimmedLine.includes("*/")) {
                comments.push({ line: multilineStartLine, text: multilineBuffer });
                inMultilineComment = false;
                multilineBuffer = '';
            }
            return;
        }

        // Single-line comment
        const singleLineCommentMatch = trimmedLine.match(/^\/\/(.*)/);
        if (singleLineCommentMatch) {
            comments.push({ line: index + 1, text: singleLineCommentMatch[0] });
            return;
        }

        // Function declarations
        const functionMatch = trimmedLine.match(/^(?:export\s+)?function\s+(\w+)\s*\(([^)]*)\)/);
        if (functionMatch && !seenFunctions.has(functionMatch[1])) {
            functions.push({
                name: functionMatch[1],
                signature: functionMatch[0],
                line: index + 1,
            });
            seenFunctions.add(functionMatch[1]);
        }

        // Arrow function declarations
        const arrowFunctionMatch = trimmedLine.match(/^(?:const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/);
        if (arrowFunctionMatch && !seenFunctions.has(arrowFunctionMatch[1])) {
            functions.push({
                name: arrowFunctionMatch[1],
                signature: arrowFunctionMatch[0],
                line: index + 1,
            });
            seenFunctions.add(arrowFunctionMatch[1]);
        }

        // Class declarations
        const classMatch = trimmedLine.match(/^(?:export\s+)?class\s+(\w+)/);
        if (classMatch) {
            classes.push({
                name: classMatch[1],
                signature: classMatch[0],
                line: index + 1,
            });
        }

        // Variable declarations (excluding function assignments)
        const varMatch = trimmedLine.match(/^(const|let|var)\s+(\w+)(\s*=[^=].*)?;/);
        if (varMatch && !seenFunctions.has(varMatch[2])) {
            vars.push({
                name: varMatch[2],
                signature: varMatch[0],
                line: index + 1,
            });
        }
    });

    const words = content
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2);
    const uniqueKeywords = Array.from(new Set(words)).slice(0, 15);

    const description = `This file contains ${functions.length} function(s), ${classes.length} class(es), ${vars.length} variable(s), ${comments.length} comment(s). This is random words from the file: ${uniqueKeywords.join(', ')}.`;

    return { functions, classes, vars, comments, description };
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

    return { vars, description, functions: [], classes: [], comments: [] };
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

        return { vars, description, functions: [], classes: [], comments: [] };
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

    return { vars, description, functions: [], classes: [], comments: [] };
};

const plaintextParser = (content: string) => {
    const linesArr = content.split('\n');
    const lines = linesArr.length;
    // Extract up to 15 unique keywords (words longer than 2 chars, ignoring duplicates)
    const words = content
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2);
    const uniqueKeywords = Array.from(new Set(words)).slice(0, 15);
    const description = `This plaintext file contains ${lines} line(s) and keywords: ${uniqueKeywords.join(', ')}.`;
    return { description, functions: [], classes: [], vars: [], comments: [] };
}

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
                case 'plaintext':
                    return {
                        ...plaintextParser(content),
                        lines
                    }
                case 'yaml':
                    return {
                        ...yamlParser(content),
                        lines
                    }
                case 'xml':
                    return {
                        ...xmlParser(content),
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
                        comments: [],
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
