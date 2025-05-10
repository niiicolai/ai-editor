
import { useDispatch } from "react-redux";
import { setOperation } from "../features/userAgentSession";
import { UserAgentSessionOperationType } from "../types/userAgentSessionOperationType";

export default () => {
  const dispatch = useDispatch();

  const execute = (json: any) => {
    dispatch(setOperation(json.payload as UserAgentSessionOperationType));
  };

  return {
    execute,
  };
};
