export const executeTerminalCommand = (cmd:string, cwd: string) => {
    return new Promise<string>((resolve) => {
        window.electron.terminalCmd(cmd, cwd);
        window.electron.onTerminalCmd((response: string) => {
            resolve(response);
        });
    });
};