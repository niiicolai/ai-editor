
interface QAInfo {
    name: string;
    path: string;
    language: string;
    type: string;
    error?: string;
    lines: number;
    keywords: string[];
    dependencies: string[];
    imports: string[];
    exports: string[];
    functions: { name: string; line_start: number; line_end: number }[];
    functionCalls: { name: string; signature: string; line_start: number; line_end: number; }[];
    classes: { name: string; line_start: number; line_end: number }[];
    variables: { name: string; line: number }[];
    comments?: { text: string; line_start: number; line_end: number }[];
    isEntryFile: boolean;
    testFramework?: string;
}

function pickRandom(strings: string[]) {
    return strings[Math.floor(Math.random() * strings.length)];
}

export const defineQA = (info: QAInfo) => {
    const qaSections: string[] = [];

    // 1. Entry File Handler
    if (info.isEntryFile) {
        const entryVariants = [
            `Q: Where can I find the code that handles the application's entry file?\nA: The application's entry file is "${info.name}".`,
            `Q: Which file initiates the application?\nA: The application starts with the entry file "${info.name}".`,
            `Q: What is the main entry point of the codebase?\nA: The entry point is defined in the file "${info.name}".`,
            `Q: Can you identify the file responsible for launching the app?\nA: Yes, it’s the entry file "${info.name}".`,
            `Q: In which file does the application boot up?\nA: The file "${info.name}" is responsible for bootstrapping the application.`,
        ];
        qaSections.push(...entryVariants);
    }

    // 2. Dependency Setup
    if (info.dependencies) {
        const dependencyVariants = [
            `Q: Which file sets up the dependencies for the application?\nA: Dependencies are set up in the file "${info.name}".`,
            `Q: Where are the application's dependencies initialized?\nA: Dependencies are initialized in the file "${info.name}".`,
            `Q: Which file manages the external libraries or modules?\nA: The file "${info.name}" handles the dependencies.`,
            `Q: Where can I see which libraries the app depends on?\nA: Check "${info.name}" for the application's dependency setup.`,
            `Q: Which part of the codebase configures third-party modules?\nA: The file "${info.name}" includes the dependency configuration.`,
        ];
        qaSections.push(...dependencyVariants);
    }

    // 3. Large Functions and Refactoring
    const functionMaxLines = 20;
    if (info.functions?.some((f) => (f.line_end - f.line_start) >= functionMaxLines)) {
        const refactorVariants = [
            `Q: Are there any files that would benefit from splitting large functions into smaller ones?\nA: Yes, the file "${info.name}" contains large functions that may benefit from being split.`,
            `Q: Are there any lengthy functions that might need to be broken up?\nA: Yes, "${info.name}" has large functions worth refactoring.`,
            `Q: Which files have overly long functions that could be simplified?\nA: The file "${info.name}" includes functions that exceed typical length.`,
            `Q: Are there parts of the code with functions longer than usual?\nA: "${info.name}" has functions that are quite long and may need to be split.`,
            `Q: Any suggestions for files needing functional decomposition?\nA: "${info.name}" contains large functions that could benefit from being broken into smaller units.`,
        ];
        qaSections.push(...refactorVariants);
    }

    // 4. Large File Cleanup Needed
    const fileMaxLines = 500;
    if (info.lines > fileMaxLines) {
        const cleanupVariants = [
            `Q: Which files may contain too many lines of code and might need cleanup?\nA: The file "${info.name}" is large with ${info.lines} lines and may require cleanup or refactoring.`,
            `Q: Which file appears excessively large and might be due for cleanup?\nA: The file "${info.name}" spans ${info.lines} lines and may require some refactoring.`,
            `Q: Are there any overly lengthy files that should be reviewed?\nA: Yes, "${info.name}" is quite long with ${info.lines} lines of code.`,
            `Q: Which parts of the codebase may be too big to manage easily?\nA: "${info.name}" is a large file and may benefit from cleanup.`,
            `Q: Can you identify files that might be too bloated?\nA: Yes, "${info.name}" has ${info.lines} lines and could use some streamlining.`,
        ];
        qaSections.push(...cleanupVariants);
    }

    // 5. Test File Identification
    if (info.type === 'test') {
        const framework = info.testFramework ? ` It uses the ${info.testFramework} testing framework.` : "";
        const testVariants = [
            `Q: Which test files can be found within the application?\nA: "${info.name}" is a test file.${framework}`,
            `Q: Which files are specifically for testing purposes?\nA: "${info.name}" is a designated test file${framework}`,
            `Q: Where can I find the test suites for the application?\nA: The file "${info.name}" contains test code${framework}`,
            `Q: Are there any files focused on automated tests?\nA: Yes, "${info.name}" serves as a test file${framework}`,
            `Q: Which file is responsible for testing parts of the application?\nA: The file "${info.name}" is dedicated to testing.${framework}`,
        ];
        qaSections.push(...testVariants);
    }

    // 6. Known Issues or Bug Fixes
    if (info.comments) {
        info.comments.forEach((c) => {
            if (/(fixme|todo|bug|hack)/i.test(c.text)) {
                const issuesVariants = [
                    `Q: Is there a known issue or bug noted in this file?\nA: Yes, at lines ${c.line_start}-${c.line_end} in "${info.name}": "${c.text.trim()}"`,
                    `Q: Where are TODOs or BUG or HACK or FIXMEs mentioned in the code?\nA: In "${info.name}", lines ${c.line_start}-${c.line_end} contain: "${c.text.trim()}"`,
                    `Q: Are there developer notes about bugs or unfinished work?\nA: "${info.name}" has a comment at lines ${c.line_start}-${c.line_end}: "${c.text.trim()}"`,
                    `Q: Can I find any bug-related comments in this file?\nA: Yes, at lines ${c.line_start}-${c.line_end} in "${info.name}": "${c.text.trim()}"`,
                    `Q: Which lines mention issues or planned fixes?\nA: Lines ${c.line_start}-${c.line_end} in "${info.name}" include: "${c.text.trim()}"`,
                ];
                qaSections.push(...issuesVariants);
            }
        });
    }

    // 7. Syntax Errors
    if (info.error) {
        const errorVariants = [
            `Q: What files contain syntax errors?\nA: Syntax errors were detected in "${info.name}": ${info.error}`,
            `Q: Which file contains invalid or broken code?\nA: The file "${info.name}" has a syntax error: ${info.error}`,
            `Q: Are there files that fail to compile due to errors?\nA: Yes, "${info.name}" contains the following syntax issue: ${info.error}`,
            `Q: Where can I find a syntax issue in the codebase?\nA: A syntax problem was found in "${info.name}": ${info.error}`,
            `Q: What files are causing compilation issues?\nA: The file "${info.name}" has a syntax error: ${info.error}`,
        ];
        qaSections.push(...errorVariants);
    }

    // 8. Class Definitions
    if (info.classes?.length > 0) {
        const classNames = info.classes.map(c => `"${c.name}"`).join(", ");
        const classVariants = [
            `Q: Which classes are defined in this file?\nA: The file "${info.name}" defines the following classes: ${classNames}.`,
            `Q: Where can I find class definitions in the codebase?\nA: The file "${info.name}" includes class definitions such as: ${classNames}.`,
            `Q: Are there any class declarations in this file?\nA: Yes, "${info.name}" contains the classes: ${classNames}.`,
            `Q: Which file includes object-oriented code?\nA: Object-oriented code is found in "${info.name}", which defines these classes: ${classNames}.`,
            `Q: What object structures or classes are defined in this file?\nA: "${info.name}" defines the following class structures: ${classNames}.`,
        ];
        qaSections.push(...classVariants);
    }

    // 9. Function Definitions
    if (info.functions?.length > 0) {
        const fnCount = info.functions.length;
        const fnLines = info.functions.map(f => f.line_end - f.line_start + 1);
        const totalFnLines = fnLines.reduce((a, b) => a + b, 0);
        const avgFnLines = fnCount > 0 ? Math.round(totalFnLines / fnCount) : 0;
        const fnVariants = [
            `Q: Are there any functions defined in this file?\nA: Yes, "${info.name}" defines ${fnCount} function${fnCount > 1 ? "s" : ""}.`,
            `Q: Where can I find the functions implemented in this codebase?\nA: The file "${info.name}" contains ${fnCount} function${fnCount > 1 ? "s" : ""}.`,
            `Q: Which file includes actual function implementations?\nA: "${info.name}" has ${fnCount} function${fnCount > 1 ? "s" : ""} defined in it.`,
            `Q: Does this file contribute logic through custom functions?\nA: Yes, it defines ${fnCount} function${fnCount > 1 ? "s" : ""} in "${info.name}".`,
            `Q: What functions are implemented here?\nA: The file "${info.name}" includes ${fnCount} implemented function${fnCount > 1 ? "s" : ""}.`,
            `Q: How many lines do the functions in this file have?\nA: The functions in "${info.name}" have an average of ${avgFnLines} line${avgFnLines !== 1 ? "s" : ""} each.`,
            `Q: Are there any particularly long or short functions in this file?\nA: In "${info.name}", function lengths range from ${Math.min(...fnLines)} to ${Math.max(...fnLines)} lines.`,
            `Q: Can you give examples of function names and their lengths?\nA: For example, ${info.functions.slice(0, 3).map(f => `"${f.name}" (${f.line_end - f.line_start + 1} lines)`).join(", ")}.`,
        ];
        qaSections.push(...fnVariants);
    }

    // 10. Variable Declarations
    if (info.variables?.length > 0) {
        const varCount = info.variables.length;
        const varNames = info.variables.slice(0, 5).map(v => `"${v.name}"`).join(", ");
        const varVariants = [
            `Q: Are there variables declared in this file?\nA: Yes, "${info.name}" includes ${varCount} variable declaration${varCount > 1 ? "s" : ""}, such as ${varNames}${varCount > 5 ? ", etc." : ""}.`,
            `Q: Which variables are defined in this file?\nA: Some of the variables declared in "${info.name}" include: ${varNames}${varCount > 5 ? ", among others" : ""}.`,
            `Q: Where can I find variable definitions?\nA: "${info.name}" contains several, including ${varNames}${varCount > 5 ? ", etc." : ""}.`,
            `Q: What are some variables declared in this file?\nA: "${info.name}" defines variables like ${varNames}${varCount > 5 ? ", and more" : ""}.`,
            `Q: Is this file responsible for setting up any key variables?\nA: Yes, it includes variables such as ${varNames}${varCount > 5 ? ", etc." : ""}.`,
        ];
        qaSections.push(...varVariants);
    }

    // 11. Function Calls
    if (info.functionCalls?.length > 0) {
        const callCount = info.functionCalls.length;
        const callNames = info.functionCalls.slice(0, 5).map(fc => `"${fc.name}"`).join(", ");
        const callVariants = [
            `Q: Which functions are called in this file?\nA: "${info.name}" includes calls to ${callNames}${callCount > 5 ? ", etc." : ""}.`,
            `Q: Are there important function invocations in this file?\nA: Yes, "${info.name}" calls functions like ${callNames}${callCount > 5 ? ", among others" : ""}.`,
            `Q: Does this file interact with other logic via function calls?\nA: It invokes several functions, including ${callNames}${callCount > 5 ? ", and more" : ""}.`,
            `Q: What are some of the function calls made in this file?\nA: "${info.name}" calls functions such as ${callNames}${callCount > 5 ? ", etc." : ""}.`,
            `Q: Is this file dependent on external or internal function calls?\nA: It includes calls to functions like ${callNames}${callCount > 5 ? ", and others" : ""}.`,
        ];
        qaSections.push(...callVariants);
    }

    // 12. Import Statements
    if (info.imports?.length > 0) {
        const importCount = info.imports.length;
        const importNames = info.imports.slice(0, 5).map(i => `"${i}"`).join(", ");
        const importVariants = [
            `Q: What does this file import?\nA: "${info.name}" imports ${importCount} module${importCount > 1 ? "s" : ""}, including ${importNames}${importCount > 5 ? ", etc." : ""}.`,
            `Q: Does this file import anything?\nA: Yes, "${info.name}" imports several modules such as ${importNames}${importCount > 5 ? ", and others" : ""}.`,
            `Q: Which dependencies are brought into this file?\nA: It includes imports like ${importNames}${importCount > 5 ? ", etc." : ""}.`,
            `Q: Where can I find files that use external modules?\nA: "${info.name}" imports modules like ${importNames}${importCount > 5 ? ", among others" : ""}.`,
            `Q: Is this file dependent on any external code?\nA: Yes, it imports modules including ${importNames}${importCount > 5 ? ", and more" : ""}.`,
        ];
        qaSections.push(...importVariants);
    }

    // 13. Export Statements
    if (info.exports?.length > 0) {
        const exportCount = info.exports.length;
        const exportNames = info.exports.slice(0, 5).map(e => `"${e}"`).join(", ");
        const exportVariants = [
            `Q: What does this file export?\nA: "${info.name}" exports ${exportCount} item${exportCount > 1 ? "s" : ""}, including ${exportNames}${exportCount > 5 ? ", etc." : ""}.`,
            `Q: Which components or functions are made public from this file?\nA: "${info.name}" exports elements such as ${exportNames}${exportCount > 5 ? ", and others" : ""}.`,
            `Q: Does this file define any exports?\nA: Yes, it exports ${exportCount} item${exportCount > 1 ? "s" : ""}, for example: ${exportNames}${exportCount > 5 ? ", etc." : ""}.`,
            `Q: Where can I find files that expose modules to other files?\nA: "${info.name}" is one such file; it exports ${exportCount} item${exportCount > 1 ? "s" : ""}, like ${exportNames}${exportCount > 5 ? ", and more" : ""}.`,
            `Q: Is this file responsible for providing reusable logic?\nA: Yes, it exports items such as ${exportNames}${exportCount > 5 ? ", among others" : ""}.`,
        ];
        qaSections.push(...exportVariants);
    }

    // 14. Language Statements
    if (info.language) {
        const language = info.language;
        const langVariants = [
            `Q: What programming language is this file written in?\nA: "${info.name}" is a ${language} file.`,
            `Q: Which language does this file use?\nA: It's written in ${language}.`,
            `Q: Can you tell me the language of "${info.name}"?\nA: This file is in ${language}.`,
            `Q: Is this a TypeScript or JavaScript file?\nA: "${info.name}" is a ${language} file.`,
            `Q: What's the file type of "${info.name}"?\nA: It’s a ${language} file based on its extension.`,
        ];
        qaSections.push(...langVariants);
    }

    // 15. Type Statements
    if (info.type) {
        const type = info.type;
        const typeVariants = [
            `Q: What is the role or type of this file?\nA: "${info.name}" is categorized as a "${type}" file.`,
            `Q: How is this file classified in the project?\nA: It is a "${type}" file.`,
            `Q: Can you tell me the type of "${info.name}"?\nA: This file is of type "${type}".`,
            `Q: What kind of file is "${info.name}"?\nA: It is considered a "${type}" file in the codebase.`,
            `Q: Is this file a source, test, config, or other type?\nA: "${info.name}" is a "${type}" file.`,
        ];
        qaSections.push(...typeVariants);
    }

    return qaSections;
};
