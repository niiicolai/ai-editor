
const operations = {
  md: {
    languages: ["javascript", "typescript"],
    execute: (
      content: string
    ): { text: string; line_start: number; line_end: number }[] => {
      const comments: { text: string; line_start: number; line_end: number }[] =
        [];

      const commentRegex = /\/\/(.*)|\/\*([\s\S]*?)\*\//g;
      let match;
      while ((match = commentRegex.exec(content)) !== null) {
        const start = match.index;
        const line = content.slice(0, start).split("\n").length;
        const commentText =
          match[1] !== undefined ? match[1].trim() : match[2].trim();
        const end = commentText.split("\n").length + line;
        comments.push({ line_start: line, line_end: end, text: commentText });
      }

      return comments;
    },
  },
} as {
  [type: string]: {
    execute: (
      content: string
    ) => { text: string; line_start: number; line_end: number }[];
    languages: string[];
  };
};

export const getComments = (content: string, language: string) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(language)) {
      return operation.execute(content);
    }
  }

  //console.warn(`Unable to determine dependencies based on ${name}`);
};
