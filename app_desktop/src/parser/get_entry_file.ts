
const operations = {
  md: {
    names: ["package.json"],
    execute: () => {
      return true
    },
  },
} as {
  [type: string]: {
    execute: () => boolean;
    names: string[];
  };
};

export const getEntryFile = (
  name: string,
) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.names.includes(name)) {
      return operation.execute();
    }
  }

  return false;
  //console.warn(`Unable to determine dependencies based on ${name}`);
};
