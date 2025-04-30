import { useState } from "react";

const executeTerminalCommand = (cmd:string) => {
    return new Promise<string>((resolve) => {
        window.electron.terminalCmd(cmd);
        window.electron.onTerminalCmd((response: string) => {
            console.log(response)
            resolve(response);
        });
    });
};

export const useTerminal = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const execute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const command = formData.get("command") as string;
    if (!command) return setFormError("You must enter a command");

    try {
      const response = await executeTerminalCommand(command);
      setMessages([...messages, command, response]);
      setMessage("");
    } catch (err) {
      setFormError(err as string);
    } finally {
        setIsLoading(false);
    }
  };

    return {
        execute,
        isLoading,
        formError,
        messages,
        message,
        setMessage
    };
};
