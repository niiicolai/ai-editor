import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { editorSettingsActions } from "../../features/editorSettings";
import DropdownComponent from "../utils/DropdownComponent";

function ViewOptionsComponent() {
  const editorSettings = useSelector((state: RootState) => state.editorSettings);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <DropdownComponent
      id="header-view-drop-down"
      className="w-48"
      buttonText="View"
      slot={
        <>
          <button
            onClick={() => navigate("/themes")}
            className="button-main w-full text-left px-2 py-1"
          >
            Themes
          </button>
          <hr className="border-color" />
          <button
            onClick={() =>
              dispatch(
                editorSettingsActions.setHierarchyMinimized(
                  !editorSettings.hierarchy.minimized
                )
              )
            }
            className="button-main w-full text-left px-2 py-1"
          >
            {editorSettings.hierarchy.minimized
              ? "Show Explorer"
              : "Hide Explorer"}
          </button>
          <hr className="border-color" />
          <button
            onClick={() =>
              dispatch(
                editorSettingsActions.setTerminalDisabled(
                  !editorSettings.terminal.disabled
                )
              )
            }
            className="button-main w-full text-left px-2 py-1"
          >
            {editorSettings.terminal.disabled
              ? "Enable Terminal"
              : "Disable Terminal"}
          </button>
          {!editorSettings.terminal.disabled && (
            <button
              onClick={() =>
                dispatch(
                  editorSettingsActions.setTerminalMinimized(
                    !editorSettings.hierarchy.minimized
                  )
                )
              }
              className="button-main w-full text-left px-2 py-1"
            >
              {editorSettings.terminal.minimized
                ? "Show Terminal"
                : "Hide Terminal"}
            </button>
          )}
        </>
      }
    />
  );
}

export default ViewOptionsComponent;
