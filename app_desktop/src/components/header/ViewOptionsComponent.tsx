import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { hierarchySettingsActions } from "../../features/hierarchySettings";
import {
  setTerminalDisabled,
  setTerminalMinimized,
} from "../../features/terminalSettings";
import DropdownComponent from "../utils/DropdownComponent";
import { useHotkeys } from "react-hotkeys-hook";
import { useTerminals } from "../../hooks/useTerminals";
import { useExternalBrowser } from "../../hooks/useExternalBrowser";

const WEBSITE_DOMAIN_URL = import.meta.env.VITE_WEBSITE_DOMAIN;
if (!WEBSITE_DOMAIN_URL) console.error('CONFIGURATION ERROR(ViewOptionsComponent.ts): VITE_WEBSITE_DOMAIN should be set in the .env file');

function ViewOptionsComponent() {
  const hierarchySettings = useSelector((state: RootState) => state.hierarchySettings);
  const shortcuts = useSelector((state: RootState) => state.shortcuts);
  const { disabled, minimized } = useSelector((state: RootState) => state.terminalSettings);
  const { closeActiveTab, newTab } = useTerminals();
  const { openExternalBrowser } = useExternalBrowser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleMinimizeTerminal = () => dispatch(setTerminalMinimized(!minimized));
  const handleMinimizeExplorer = () => dispatch(hierarchySettingsActions.setHierarchyMinimized(!hierarchySettings.minimized));
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
            onClick={() => openExternalBrowser(`${WEBSITE_DOMAIN_URL}/docs`)}
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
          <hr className="border-color" />
          <button
            onClick={() => dispatch(
              hierarchySettingsActions.setHierarchyMinimized(
                !hierarchySettings.minimized
              )
            )}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            
              <span>{hierarchySettings.minimized
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
