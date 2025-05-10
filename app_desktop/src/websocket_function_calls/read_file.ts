import { useFiles } from "../hooks/useFiles";

export default () => {
  const files = useFiles();

  const execute = async (_id: string, clientFn: any, sendMessage: (msg: string) => void) => {
    const parsedArgs = JSON.parse(JSON.parse(clientFn?.args));
    const path = parsedArgs.path;
    console.log("Read file path:", path);
    const fileContent = (await files.readFile(path)) as any;
    console.log("Read file content:", fileContent);
    sendMessage(
      JSON.stringify({
        event: "client_function_result",
        data: {
          _id: _id,
          content:
            fileContent?.trim()?.length > 0
              ? `The file at ${path} has the following content:\n\n${fileContent}`
              : `The file at ${path} is empty.`, 
        },
      })
    );
  };

  return {
    execute,
  };
};
