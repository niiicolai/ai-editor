import { useState } from "react";
import { TerminalType } from "../types/terminalType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setTerminals } from "../features/terminals";
import { executeTerminalCommand } from "../electron/executeTerminalCommand";

export const useTerminal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();
  const { terminals } = useSelector((state: RootState) => state.terminals);

  const execute = async (
    e: React.FormEvent<HTMLFormElement>,
    t: TerminalType
  ) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const command = formData.get("command") as string;
    if (!command) return setFormError("You must enter a command");

    const index = terminals.findIndex(
      (terminal: TerminalType) => terminal.id == t.id
    );
    if (index == -1) return setFormError("Unable to find terminal");

    try {
      const response = await executeTerminalCommand(command);
      const updatedTerminal = {
        ...terminals[index],
        messages: [
          ...(terminals[index].messages || []),
          `${new Date().getTime().toString()}: ${command}`,
          `${new Date().getTime().toString()}: ${response || "No response"}`,
        ],
      };
      const newTerminals = [
        ...terminals.slice(0, index),
        updatedTerminal,
        ...terminals.slice(index + 1),
      ];
      dispatch(setTerminals(newTerminals));
      setMessage("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const executeString = async (cmd: string) => {
    setFormError(null);
    setIsLoading(true);

    try {
      await executeTerminalCommand(cmd);
      setMessage("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    formError,
    message,
    setMessage,
    executeString
  };
};
