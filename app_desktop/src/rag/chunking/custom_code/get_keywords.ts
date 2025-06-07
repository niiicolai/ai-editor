
const operations = {
  md: {
    languages: ["markdown"],
    execute: (content: string, noOfKeywords: number) => {
    // Extract titles (h1, h2, h3)
    const matches = Array.from(
      content.matchAll(/^#{1,3}\s+(.+)$/gm)
    );
    const titles = matches.map((match) => match[1].trim());

    // Extract all words (excluding titles)
    const titleWords = new Set(
      titles.flatMap(title => title.split(/\s+/).map(w => w.toLowerCase()))
    );
    const allWords = content
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 2 && !titleWords.has(word.toLowerCase()));

    // Shuffle and pick random keywords
    const shuffled = allWords.sort(() => 0.5 - Math.random());
    const randomKeywords = Array.from(new Set(shuffled)).slice(0, Math.max(0, noOfKeywords - titles.length));

    // Combine titles and random keywords
    return [...titles, ...randomKeywords].slice(0, noOfKeywords);
    },
  },
} as {
  [type: string]: {
    execute: (content: string, noOfKeywords: number) => string[];
    languages: string[];
  };
};

export const getKeywords = (
  content: string,
  language: string,
  noOfKeywords = 15
) => {
  for (const [, operation] of Object.entries(operations)) {
    if (operation.languages.includes(language)) {
      return operation.execute(content, noOfKeywords);
    }
  }

  const words = content
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2);

  return Array.from(new Set(words)).slice(0, noOfKeywords);
};
