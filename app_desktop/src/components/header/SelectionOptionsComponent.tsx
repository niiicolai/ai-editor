import { useDispatch, useSelector } from "react-redux";
import { useFileTabs } from "../../hooks/useFileTabs";
import { RootState } from "../../store";
import DropdownComponent from "../utils/DropdownComponent";
import { useHotkeys } from "react-hotkeys-hook";
import { setNextEditorCommand } from "../../features/editor";

function SelectionOptionsComponent() {
  const { closeActiveTab } = useFileTabs();
  const shortcuts = useSelector((state: RootState) => state.shortcuts);
  const dispatch = useDispatch();
  const exeEditorCmd = (cmd:string) => dispatch(setNextEditorCommand(cmd));
  useHotkeys(shortcuts.close.join('+'), () => closeActiveTab(), [closeActiveTab]);
  useHotkeys(shortcuts.select_all.join('+'), () => exeEditorCmd('select-all'), [exeEditorCmd]);

  return (
    <DropdownComponent
      id="header-selection-drop-down"
      className="w-48"
      buttonText="Selection"
      slot={
        <>
          <button
            data-testid="editor-header-select-all-button"
            onClick={() => exeEditorCmd('select-all')}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Select All</span>
            <span>{shortcuts.select_all.join(' + ')}</span>
          </button>
          <hr className="border-color" />
          <button
            data-testid="editor-header-close-active-tab-button"
            onClick={() => closeActiveTab()}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Close Active Tab</span>
            <span>{shortcuts.close.join(' + ')}</span>
          </button>
        </>
      }
    />
  );
}

export default SelectionOptionsComponent;
