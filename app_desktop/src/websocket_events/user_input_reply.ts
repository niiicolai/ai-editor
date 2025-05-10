import { useDispatch } from "react-redux";
import { addMessage } from "../features/userAgentSession";
import { UserAgentSessionMessageType } from "../types/userAgentSessionMessageType";


export default () => {
  const dispatch = useDispatch();

  const execute = (json: any) => {
    dispatch(addMessage(json.payload as UserAgentSessionMessageType));
  };

  return {
    execute,
  };
};
