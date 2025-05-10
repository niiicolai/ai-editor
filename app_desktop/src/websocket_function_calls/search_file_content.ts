import { useTerminal } from "../hooks/useTerminal";

export default () => {
  const terminal = useTerminal();

  const execute = async (_id: string, clientFn: any, sendMessage: (msg: string) => void) => {
    const parsedArgs = JSON.parse(JSON.parse(clientFn?.args));
    const path = parsedArgs.path;
    const pattern = parsedArgs.pattern;

    const searchResult = (await terminal.executeString(
      `powershell -Command "Get-ChildItem -Path '${path}' -Recurse -Include *.js -File | Where-Object { -not $_.FullName.Contains('node_modules') } | Select-String -Pattern '${pattern}'"`
    )) as any;

    sendMessage(
      JSON.stringify({
        event: "client_function_result",
        data: {
          _id: _id,
          content:
            searchResult?.trim()?.length > 0
              ? `The search result for pattern '${pattern}' in ${path} is:\n\n${searchResult}`
              : `No matches found for pattern '${pattern}' in ${path}. Please check the path or try another pattern.`,
        },
      })
    );
  };

  return {
    execute,
  };
};
