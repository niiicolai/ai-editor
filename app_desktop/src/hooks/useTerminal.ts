import { useState } from "react";
import { TerminalType } from "../types/terminalType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setTerminals } from "../features/terminals";
import { executeTerminalCommand } from "../electron/executeTerminalCommand";
import { fileOrDirExists } from "../electron/fileOrDirExists";

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
      let response: string | null = null;
      let cwd = t.cwd;

      // Bypass cd and change directory to the terminal's cwd
      if (command.match(/^cd\s/)) {
        const newPath = command.replace("cd ", "").trim();
        if (!newPath) return setFormError("You must specify a directory to change to");
        const isAbsolute = newPath.startsWith("/") || newPath.match(/^[a-zA-Z]:/);
        cwd = isAbsolute ? newPath : `${t.cwd}/${newPath}`;
        // if ../ is used, resolve the path
        cwd = cwd.replace(/\/\.\//g, "/").replace(/\/[^/]+\/\.\.\//g, "/");
        // if .. is used, resolve the path
        cwd = cwd.replace(/\/[^/]+\/\.\.\//g, "/");
        // Check if the directory exists
        if (!(await fileOrDirExists(cwd))) {
          return setFormError(`Directory does not exist: ${cwd}`);
        }
        response = `Changed directory to ${cwd}`;
      } else {
        response = await executeTerminalCommand(command, t.cwd);
        if (response) {
          response = response.split("\n").filter((s:string)=>s.trim().length>0).map((s:string)=>{
            return `${new Date().getTime().toString()}: ${s}`.trim();
          }).join("\n");
        }
      }

      const updatedTerminal = {
        ...terminals[index],
        cwd,
        messages: [
          ...(terminals[index].messages || []),
          `${new Date().getTime().toString()}: ${command}`,
          `${response || "No response"}`,
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

  const executeString = async (cmd: string, cwd: string) => {
    setFormError(null);
    setIsLoading(true);

    try {
      await executeTerminalCommand(cmd, cwd);
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
