
const fileType = {
  test: {
    name: "test",
    regex: /test/,
  },
  environment: {
    name: "environment",
    regex: /env/,
  },
  config: {
    name: "config",
    endings: ["json", "xml", "yaml"],
    regex: /config/,
  },
  documentation: {
    name: "documentation",
    endings: ["md"],
  },
  module: {
    name: "module",
    endings: ["js", "ts"],
  },
  stylesheet: {
    name: "stylesheet",
    endings: ["css", "scss"],
  },
  markup: {
    name: "markup",
    endings: ["html"],
  }
} as {
  [type: string]: {
    name: string;
    regex?: RegExp;
    endings?: string[];
  };
};

export const getType = (name: string) => {
  for (const [, type] of Object.entries(fileType)) {
    if (type.regex && name.match(type.regex)) {
      return type.name;
    }

    if (type.endings) {
      const nameSplitted = name.split(".");
      const fileEnding = (
        nameSplitted.length >= 0 ? nameSplitted[nameSplitted.length - 1] : ""
      ).toLowerCase();
      if (type.endings.includes(fileEnding)) {
        return type.name;
      }
    }
  }

  console.error(`Couldn't determine type of ${name}`);
};
