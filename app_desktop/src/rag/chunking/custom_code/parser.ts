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
import { defineQA } from "./define_qa";
import { getTestFramework } from "./get_test_framework";

export const parseCustomCode = (
  name: string,
  path: string,
  content: string,
  language: string
) => {
  const info = {
    name,
    language,
    path,
    type: getType(name),
    error: getError(name, content, language),
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
    testFramework: getTestFramework(content, language)
  };

  return { info, qaSections: defineQA(info as any) };
};

