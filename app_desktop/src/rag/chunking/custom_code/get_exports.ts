
const operations = {
  md: {
    languages: ["javascript", "typescript"],
    execute: (content: string): string[] => {
      const matches = Array.from(
        content.matchAll(/^export(.*?)$/gm)
      );
      return matches.map(match => match[0]).filter(Boolean);
    },
  },
} as {
  [type: string]: {
    execute: (content: string) => string[];
    languages: string[];
  };
};

export const getExports = (
  content: string,
  languages: string,
) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(languages)) {
      return operation.execute(content);
    }
  }

  //console.warn(`Unable to determine dependencies based on ${name}`);
};
