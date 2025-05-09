export const moveItemToTrash = (path: string) => {
  return new Promise<string>((resolve) => {
    window.electron.moveItemToTrash(path);
    window.electron.onMoveItemToTrash(() => {
      resolve(path);
    });
  });
};
