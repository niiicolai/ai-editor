import { useFiles } from "../hooks/useFiles";

export default () => {
  const files = useFiles();

  const execute = async (_id: string, clientFn: any, sendMessage: (msg: string) => void) => {
    const parsedArgs = JSON.parse(JSON.parse(clientFn?.args));
    const path = parsedArgs.path;

    const resultContent = (await files.readDirectory(path)) as any;

    sendMessage(
      JSON.stringify({
        event: "client_function_result",
        data: {
          _id: _id,
          content:
            resultContent?.length > 0
              ? `The files at ${path} are:\n\n${JSON.stringify(resultContent)}`
              : `No files were found at ${path}. Please check the path or try another directory.`,
        },
      })
    );
  };

  return {
    execute,
  };
};
