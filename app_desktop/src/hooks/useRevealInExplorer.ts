import { revealInExplorer } from "../electron/revealInExplorer"; 

export const useRevealInExplorer = () => {

  const reveal = async (path: string) => {
    try {
      await revealInExplorer(path);
    } catch (error) {
      console.error("Error revealing in explorer:", error);
    }
  };

  return { reveal };
};
