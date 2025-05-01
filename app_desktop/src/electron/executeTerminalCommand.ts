export const executeTerminalCommand = (cmd:string) => {
    return new Promise<string>((resolve) => {
        window.electron.terminalCmd(cmd);
        window.electron.onTerminalCmd((response: string) => {
            resolve(response);
        });
    });
};