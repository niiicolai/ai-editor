import { useFiles } from "../hooks/useFiles";

export default () => {
  const files = useFiles();

  const execute = async (_id: string, clientFn: any, sendMessage: (msg: string) => void) => {
    const parsedArgs = JSON.parse(JSON.parse(clientFn?.args));
    const path = parsedArgs.path;
    const content = parsedArgs.content;

    await files.writeFile(path, content);

    sendMessage(
      JSON.stringify({
        event: "client_function_result",
        data: {
          _id: _id,
          content: `Successfully wrote to the file at ${path}.`,
        },
      })
    );
  };

  return {
    execute,
  };
};
