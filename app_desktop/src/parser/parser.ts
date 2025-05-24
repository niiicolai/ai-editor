import { getType } from "./get_type";
import { getError } from "./get_error";
import { getKeywords } from "./get_keywords";
import { getDependencies } from "./get_dependencies";
import { getImports } from "./get_imports";
import { getExports } from "./get_exports";
import { getFunctions } from "./get_functions";
import { getClasses } from "./get_classes";
import { getVariables } from "./get_variables";
import { getComments } from "./get_comments";
import { getFunctionCalls } from "./get_function_calls";
import { getEntryFile } from "./get_entry_file";

export const parse = (
  name: string,
  path: string,
  content: string,
  language: string
) => {
  const info = {
    name,
    language,
    type: getType(name) as any,
    error: getError(name, content, language) as any,
    lines: content.split(/\n/).length,
    keywords: getKeywords(content, language),
    dependencies: getDependencies(name, content),
    imports: getImports(content, language),
    exports: getExports(content, language),
    functions: getFunctions(content, language),
    functionCalls: getFunctionCalls(content, language),
    classes: getClasses(content, language),
    variables: getVariables(content, language),
    comments: getComments(content, language),
    isEntryFile: getEntryFile(name),
  };

  return { info, doc: generateSelectiveRAGDoc(info) };
};

function generateSelectiveRAGDoc(info:any) {
  const qaSections = [];

  // 1. Entry File Handler
  if (info.isEntryFile) {
    qaSections.push(`Q: Where can I find the code that handles the application's entry file?
A: The application's entry file is "${info.name}".`);
  }

  // 2. Dependency Setup
  if (info.dependencies) {
    qaSections.push(`Q: Which file sets up the dependencies for the application?
A: Dependencies are set up in the file "${info.name}".`);
  }

  // 3. Large Functions and Refactoring
  if (info.functions?.some((f:any) => f.lines > 50)) {
    qaSections.push(`Q: Are there any files that would benefit from splitting large functions into smaller ones?
A: Yes, the file "${info.name}" contains large functions that may benefit from being split.`);
  }

  // 4. Large File Cleanup Needed
  if (info.lines > 500) {
    qaSections.push(`Q: Which files may contain too many lines of code and might need cleanup?
A: The file "${info.name}" is large with ${info.lines} lines and may require cleanup or refactoring.`);
  }

  // 5. Test File Identification
  if (info.type === 'test') {
    qaSections.push(`Q: Which test files can be found within the application?
A: "${info.name}" is a test file.${info.testFramework ? ` It uses the ${info.testFramework} testing framework.` : ""}`);
  }

  // 6. Known Issues or Bug Fixes
  if ((info.comments ?? []).some((c:any) => /(fixme|todo|bug|hack)/i.test(c.text))) {
    qaSections.push(`Q: What parts of the project have known issues or recent bug fixes?
A: The file "${info.name}" contains comments mentioning issues or fixes.`);
  }

  // 7. Syntax Errors
  if (info.error) {
    qaSections.push(`Q: What files contain syntax errors?
A: Syntax errors were detected in "${info.name}": ${info.error}`);
  }

  return qaSections.join("\n");
}
