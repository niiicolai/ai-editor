import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { editorSettingsActions } from "../../features/editorSettings";
import {
  setTerminalDisabled,
  setTerminalMinimized,
} from "../../features/terminalSettings";
import DropdownComponent from "../utils/DropdownComponent";
import { useHotkeys } from "react-hotkeys-hook";
import { useTerminals } from "../../hooks/useTerminals";
import { useExternalBrowser } from "../../hooks/useExternalBrowser";

function ViewOptionsComponent() {
  const editorSettings = useSelector((state: RootState) => state.editorSettings);
  const shortcuts = useSelector((state: RootState) => state.shortcuts);
  const { disabled, minimized } = useSelector((state: RootState) => state.terminalSettings);
  const { closeActiveTab, newTab } = useTerminals();
  const { openExternalBrowser } = useExternalBrowser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleMinimizeTerminal = () => dispatch(setTerminalMinimized(!minimized));
  const handleMinimizeExplorer = () => dispatch(editorSettingsActions.setHierarchyMinimized(!editorSettings.hierarchy.minimized));
  useHotkeys(shortcuts.close_active_terminal.join('+'), () => closeActiveTab(), [closeActiveTab]);
  useHotkeys(shortcuts.new_terminal.join('+'), () => newTab(), [newTab]);
  useHotkeys(shortcuts.hide_terminal.join('+'), () => handleMinimizeTerminal(), [handleMinimizeTerminal]);
  useHotkeys(shortcuts.hide_explorer.join('+'), () => handleMinimizeExplorer(), [handleMinimizeExplorer]);

  return (
    <DropdownComponent
      id="header-view-drop-down"
      className="w-64"
      buttonText="View"
      slot={
        <>
          <button
            onClick={() => navigate("/themes")}
            className="button-main w-full text-left px-2 py-1"
          >
            Themes
          </button>
          <button
            onClick={() => openExternalBrowser("http://localhost:5173/docs")}
            className="button-main w-full text-left px-2 py-1"
          >
            Documentation
          </button>
          <button
            onClick={() => navigate("/shortcuts")}
            className="button-main w-full text-left px-2 py-1"
          >
            Shortcuts
          </button>
          <button
            onClick={() => navigate("/extensions")}
            className="button-main w-full text-left px-2 py-1"
          >
            Extensions
          </button>
          <hr className="border-color" />
          <button
            onClick={() => dispatch(
              editorSettingsActions.setHierarchyMinimized(
                !editorSettings.hierarchy.minimized
              )
            )}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            
              <span>{editorSettings.hierarchy.minimized
              ? "Show Explorer"
              : "Hide Explorer"}</span>
              <span>{shortcuts.hide_explorer.join(" + ")}</span>
          </button>
          <hr className="border-color" />
          <button
            onClick={() => dispatch(setTerminalDisabled(!disabled))}
            className="button-main w-full text-left px-2 py-1"
          >
            {disabled ? "Enable Terminal" : "Disable Terminal"}
          </button>
          {!disabled && (
            <>
              <button className="button-main w-full text-left px-2 py-1 flex justify-between">
                <span>Close Active Terminal</span>
                <span>{shortcuts.close_active_terminal.join(" + ")}</span>
              </button>
              <button
                onClick={() =>
                  dispatch(setTerminalMinimized(!minimized))
                }
                className="button-main w-full text-left px-2 py-1 flex justify-between"
              >
                <span>{minimized ? "Show Terminal" : "Hide Terminal"}</span>
                <span>{shortcuts.hide_terminal.join(" + ")}</span>
              </button>
              <button onClick={() => newTab()}
              className="button-main w-full text-left px-2 py-1 flex justify-between">
                <span>New Terminal</span>
                <span>{shortcuts.new_terminal.join(" + ")}</span>
              </button>
            </>
          )}
        </>
      }
    />
  );
}

export default ViewOptionsComponent;
