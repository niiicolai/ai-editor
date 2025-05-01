import { useDispatch, useSelector } from "react-redux";
import { TerminalType } from "../types/terminalType";
import { RootState } from "../store";
import { setTerminals, setSelectedIndex } from "../features/terminals";

export const useTerminals = () => {
  const { terminals, selectedIndex } = useSelector((state: RootState) => state.terminals);
  const dispatch = useDispatch();

  const isActiveTab = (t: TerminalType) => {
    if (selectedIndex < 0) return false;
    return terminals[selectedIndex]?.id === t.id;
  }

  const closeActiveTab = () => {
    if (selectedIndex > -1) removeTab(terminals[selectedIndex]);
  };

  const viewTab = (t: TerminalType) => {
    const index = terminals.findIndex((terminal:TerminalType) => terminal.id == t.id);
    if (index > -1) {
      dispatch(setSelectedIndex(index));
    }
  };

  const removeTab = (t: TerminalType) => {
    let i = 0;
    const newTerminals = [...terminals];
    for (const terminal of newTerminals) {
      if (terminal.id === t.id) {
        newTerminals.splice(i, 1); // Remove the tab at index i
        break;
      }
      i++;
    }
    if (newTerminals.length === 0) {
        const newTerminal = { id: new Date().getTime().toString(), messages: [] };
      dispatch(setTerminals([newTerminal]));
      viewTab(newTerminal);
    } else {
      const index = terminals.findIndex((terminal:TerminalType) => terminal.id == t.id);
      if (selectedIndex === index) dispatch(setSelectedIndex(0));
      dispatch(setTerminals([...newTerminals]));
    }
  };

  const newTab = () => {
    const newTerminal = { id: new Date().getTime().toString(), messages: [] };
    dispatch(setTerminals([...terminals, newTerminal]));
    dispatch(setSelectedIndex(terminals.length - 1));
  }

  return { viewTab, removeTab, isActiveTab, newTab, closeActiveTab, terminals }
};
