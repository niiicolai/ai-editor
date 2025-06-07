import { useFiles } from "../hooks/useFiles";
import { useFileOrDirExists } from "../hooks/useFileOrDirExists";

export default () => {
  const files = useFiles();
  const fileExist = useFileOrDirExists();

  const execute = async (_id: string, clientFn: any, sendMessage: (msg: string) => void) => {
    const parsedArgs = JSON.parse(clientFn?.args);
    const path = parsedArgs.path;
    if (!path) {
      sendMessage(
        JSON.stringify({
          event: "client_function_result",
          data: {
            _id: _id,
            content: "No path provided. Please provide a valid file path.",
          },
        })
      );
      return;
    }

    const exists = await fileExist.exists(path);
    if (!exists) {
      console.log("File does not exist at path:", path);
      sendMessage(
        JSON.stringify({
          event: "client_function_result",
          data: {
            _id: _id,
            content: `The file at ${path} does not exist. Please check the path and try again.`,
          },
        })
      );
      return;
    }

    // If the file exists, read its content
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
