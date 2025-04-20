

const openExternalBrowser = (url:string) => {
    return new Promise<string>(() => {
        window.electron.openExternalBrowser(url);
    });
};

export const useExternalBrowser = () => {

    return {
        openExternalBrowser,
    };
};
