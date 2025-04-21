

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

    return {
        executeTerminalCommand,
    };
};
