import LlmService from "../../../services/llmService";

const response_format = {
  type: "json_schema",
  json_schema: {
    name: "qa",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              answer: { type: "string" },
            },
          },
        },
      },
    },
  },
};

const prompt = (
  path: string,
  content: string,
  language: string
) => 
`
You are writing question and answers for ${path} a ${language} file part of a coding project.
You are describing areas related to navigation, debugging, testing and refactoring.
You must create at least 1 QA.

You can look for following: 
- Codebase entry-points: e.g. package.json; 
- dependencies: e.g. module imports;
- scripts: e.g. npm start;
- functions: e.g. number of functions, the size of functions, if any functions have more than 10 lines;
- classes: e.g. number of classes, the number of function the class has, if the class have too many functions;
- variables: e.g. names of variables; long variable names;
- comments: e.g. the purpose of the comment, @todo, @bug, @hack;
- syntax errors: e.g. missing curly brackets;
- test: e.g. test cases, test framework;

!!! UNBREAKABLE RULES !!!
- The question or answer must contain the name of the file for additional context.
- Do not mention names about anything you can not find within the content.
- Avoid could question and answers.
- If the file does not contain **any** of these elements, return **nothing**.
- Do not invent or assume content exists. 
- Only base your output on what is explicitly present in the following content:
${content}
`

export const parseLanguageModelAugmentation = async (
  path: string,
  content: string,
  language: string
) => {
  const llmContent = await LlmService.create({
    event: "language_model_augmentation",
    messages: [
      {
        role: "user",
        content: prompt(path, content, language),
      },
    ],
    response_format,
  });

  const qaSections = JSON.parse(llmContent.content).items.map((i: any) =>
    JSON.stringify(`Q:${i.question};\nA:${i.answer};`)
  );
  return qaSections;
};
