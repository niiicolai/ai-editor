const frameworks = [
    "ava",
    "buster",
    "chai",
    "cypress",
    "enzyme",
    "expect",
    "intern",
    "jest",
    "jest-circus",
    "jest-jasmine2",
    "jasmine",
    "karma",
    "lab",
    "mocha",
    "nightmare",
    "node-tap",
    "playwright",
    "protractor",
    "puppeteer",
    "qunit",
    "sinon",
    "supertest",
    "tape",
    "testcafe",
    "uvu",
    "vitest",
    "webdriverio",
    "zora"
];

const operations = {
  md: {
    languages: ["javascript", "typescript", "json"],
    execute: (content: string) => {
      // Simple detection: check if any framework name appears in the content
      return frameworks.filter(fw => content.includes(fw));
    },
  },
} as {
  [type: string]: {
    execute: (content: string) => string[];
    languages: string[];
  };
};

export const getTestFramework = (
  content: string,
  language: string,
) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(language)) {
      return operation.execute(content);
    }
  }

  return null;
};
