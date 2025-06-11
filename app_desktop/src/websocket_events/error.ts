import { useDispatch } from "react-redux";
import { addMessage } from "../features/userAgentSession";
import { UserAgentSessionMessageType } from "../types/userAgentSessionMessageType";
import { v4 as uuidV4 } from "uuid";

export default () => {
  const dispatch = useDispatch();

  const execute = (json: any) => {
    dispatch(addMessage({
        _id: uuidV4(),
        content: json.payload.content,
        code: json.payload.code,
        state: 'completed',
        role: 'error',
        created_at: new Date().toString(),
        updated_at: new Date().toString()
    } as UserAgentSessionMessageType));
  };

  return {
    execute,
  };
};
