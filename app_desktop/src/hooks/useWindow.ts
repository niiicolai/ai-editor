

const minimizeWindow = () => {
    return new Promise<string>(() => {
        window.electron.minimizeWindow();
    });
};

const restoreWindow = () => {
    return new Promise<string>(() => {
        window.electron.restoreWindow();
    });
};

const closeWindow = () => {
    return new Promise<string>(() => {
        window.electron.closeWindow();
    });
};

export const useWindow = () => {

    return {
        minimizeWindow,
        restoreWindow,
        closeWindow,
    };
};
