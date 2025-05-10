import { useDispatch } from "react-redux";
import { setMessages } from "../features/userAgentSession";
import { UserAgentSessionMessageType } from "../types/userAgentSessionMessageType";
import { RootState } from "../store";
import { useSelector } from "react-redux";

import searchFileContent from "../websocket_function_calls/search_file_content";
import readFile from "../websocket_function_calls/read_file";
import listDirectory from "../websocket_function_calls/list_directory";
import writeFile from "../websocket_function_calls/write_file";

export default () => {
  const { messages } = useSelector(
    (state: RootState) => state.userAgentSession
  );
  const dispatch = useDispatch();
  const searchFileContentFn = searchFileContent();
  const readFileFn = readFile();
  const listDirectoryFn = listDirectory();
  const writeFileFn = writeFile();

  const execute = (json: any, sendMessage: (msg: string) => void) => {
    const message = json.payload as UserAgentSessionMessageType;
    const updatedMessages = messages.map((msg) => {
      if (msg._id === message._id) {
        return { ...msg, ...message };
      }
      return msg;
    });
    dispatch(setMessages(updatedMessages));

    const clientFn = message?.clientFn;

    if (clientFn?.name == "Search_File_Content") {
      searchFileContentFn.execute(
        message._id,
        clientFn,
        sendMessage
      );
    } else if (clientFn?.name == "Read_File") {
      readFileFn.execute(message._id, clientFn, sendMessage);
    } else if (clientFn?.name == "Write_File") {
      writeFileFn.execute(message._id, clientFn, sendMessage);
    } else if (clientFn?.name == "List_Directory") {
      listDirectoryFn.execute(message._id, clientFn, sendMessage);
    }
  };

  return {
    execute,
  };
};
