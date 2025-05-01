export const useGetLanguage = () => {
  const getLanguageFromFile = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "mjs":
      case "cjs":
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "scss":
      case "sass":
        return "scss";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "py":
        return "python";
      case "java":
        return "java";
      case "c":
        return "c";
      case "cpp":
      case "cc":
      case "cxx":
        return "cpp";
      case "cs":
        return "csharp";
      case "go":
        return "go";
      case "rs":
        return "rust";
      case "rb":
        return "ruby";
      case "php":
        return "php";
      case "sh":
        return "shell";
      case "yaml":
      case "yml":
        return "yaml";
      case "xml":
        return "xml";
      default:
        return "plaintext";
    }
  };

  const getAllLanguages = () => {
    return [
      "javascript",
      "typescript",
      "html",
      "css",
      "scss",
      "json",
      "markdown",
      "python",
      "java",
      "c",
      "cpp",
      "csharp",
      "go",
      "rust",
      "ruby",
      "php",
      "shell",
      "yaml",
      "xml",
      "plaintext",
    ];
  };

  return { getLanguageFromFile, getAllLanguages };
};
