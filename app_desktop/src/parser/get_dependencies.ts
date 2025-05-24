
const operations = {
  md: {
    names: ["package.json"],
    execute: (content: string) => {
      const json = JSON.parse(content);
      const dependencies = {
        ...json?.dependencies ?? {},
        ...json?.devDependencies ?? {}
      };
      
      return Object.values(dependencies).length 
        ? Object.entries(dependencies).map((d) => JSON.stringify(d))
        : []
    },
  },
} as {
  [type: string]: {
    execute: (content: string) => string[];
    names: string[];
  };
};

export const getDependencies = (
  name: string,
  content: string
) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.names.includes(name)) {
      return operation.execute(content);
    }
  }

  //console.warn(`Unable to determine dependencies based on ${name}`);
};
