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
import { userAgentSessionSettingsActions } from "../../features/userAgentSessionSettings";

const WEBSITE_DOMAIN_URL = import.meta.env.VITE_WEBSITE_DOMAIN;
if (!WEBSITE_DOMAIN_URL)
  console.error(
    "CONFIGURATION ERROR(ViewOptionsComponent.ts): VITE_WEBSITE_DOMAIN should be set in the .env file"
  );

function ViewOptionsComponent() {
  const hierarchySettings = useSelector(
    (state: RootState) => state.hierarchySettings
  );
  const shortcuts = useSelector((state: RootState) => state.shortcuts);
  const { disabled, minimized } = useSelector(
    (state: RootState) => state.terminalSettings
  );
  const userAgentSessionSettings = useSelector(
    (state: RootState) => state.userAgentSessionSettings
  );
  const { closeActiveTab, newTab } = useTerminals();
  const { openExternalBrowser } = useExternalBrowser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleMinimizeTerminal = () =>
    dispatch(setTerminalMinimized(!minimized));
  const handleMinimizeExplorer = () =>
    dispatch(
      hierarchySettingsActions.setHierarchyMinimized(
        !hierarchySettings.minimized
      )
    );
  useHotkeys(
    shortcuts.close_active_terminal.join("+"),
    () => closeActiveTab(),
    [closeActiveTab]
  );
  useHotkeys(shortcuts.new_terminal.join("+"), () => newTab(), [newTab]);
  useHotkeys(
    shortcuts.hide_terminal.join("+"),
    () => handleMinimizeTerminal(),
    [handleMinimizeTerminal]
  );
  useHotkeys(
    shortcuts.hide_explorer.join("+"),
    () => handleMinimizeExplorer(),
    [handleMinimizeExplorer]
  );
  useHotkeys(
    shortcuts.hide_agent.join("+"),
    () =>
      dispatch(
        userAgentSessionSettingsActions.setMinimized(
          !userAgentSessionSettings.minimized
        )
      ),
    [userAgentSessionSettings, dispatch]
  );

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
            data-testid="editor-header-themes-button"
          >
            Themes
          </button>
          <button
            onClick={() => openExternalBrowser(`${WEBSITE_DOMAIN_URL}/docs`)}
            className="button-main w-full text-left px-2 py-1"
            data-testid="editor-header-documentation-button"
          >
            Documentation
          </button>
          <button
            onClick={() => navigate("/shortcuts")}
            className="button-main w-full text-left px-2 py-1"
            data-testid="editor-header-shortcuts-button"
          >
            Shortcuts
          </button>
          <button
            onClick={() => navigate("/rag")}
            className="button-main w-full text-left px-2 py-1"
            data-testid="editor-header-rag-button"
          >
            RAG Settings
          </button>
          <hr className="border-color" />
          <button
            data-testid="editor-header-hide-explorer-button"
            onClick={() =>
              dispatch(
                hierarchySettingsActions.setHierarchyMinimized(
                  !hierarchySettings.minimized
                )
              )
            }
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>
              {hierarchySettings.minimized ? "Show Explorer" : "Hide Explorer"}
            </span>
            <span>{shortcuts.hide_explorer.join(" + ")}</span>
          </button>
          <hr className="border-color" />
          <button
            data-testid="editor-header-hide-agent-button"
            onClick={() =>
              dispatch(
                userAgentSessionSettingsActions.setMinimized(
                  !userAgentSessionSettings.minimized
                )
              )
            }
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>
              {userAgentSessionSettings.minimized ? "Show Agent" : "Hide Agent"}
            </span>
            <span>{shortcuts.hide_agent.join(" + ")}</span>
          </button>
          <hr className="border-color" />
          <button
            data-testid="editor-header-disable-terminal-button"
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
                data-testid="editor-header-hide-terminal-button"
                onClick={() => dispatch(setTerminalMinimized(!minimized))}
                className="button-main w-full text-left px-2 py-1 flex justify-between"
              >
                <span>{minimized ? "Show Terminal" : "Hide Terminal"}</span>
                <span>{shortcuts.hide_terminal.join(" + ")}</span>
              </button>
              <button
                data-testid="editor-header-new-terminal-button"
                onClick={() => newTab()}
                className="button-main w-full text-left px-2 py-1 flex justify-between"
              >
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
