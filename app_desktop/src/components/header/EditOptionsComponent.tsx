import { useDispatch, useSelector } from "react-redux";
import { setSearchVisible } from "../../features/search";
import DropdownComponent from "../utils/DropdownComponent";
import { RootState } from "../../store";
import { useHotkeys } from "react-hotkeys-hook";
import { setNextEditorCommand } from "../../features/editor";

function EditOptionsComponent() {
  const shortcuts = useSelector((state: RootState) => state.shortcuts);
  const dispatch = useDispatch();
  const handleFind = () => dispatch(setSearchVisible(true));
  const exeEditorCmd = (cmd:string) => dispatch(setNextEditorCommand(cmd));
  useHotkeys(shortcuts.find.join('+'), () => handleFind(), {}, [handleFind])
  //useHotkeys(shortcuts.copy.join('+'), () => exeEditorCmd('copy'), {}, [exeEditorCmd])
  //useHotkeys(shortcuts.paste.join('+'), () => exeEditorCmd('paste'), {}, [exeEditorCmd])
  //useHotkeys(shortcuts.cut.join('+'), () => exeEditorCmd('cut'), {}, [exeEditorCmd])
  //useHotkeys(shortcuts.undo.join('+'), () => exeEditorCmd('undo'), {}, [exeEditorCmd])
  //useHotkeys(shortcuts.redo.join('+'), () => exeEditorCmd('redo'), {}, [exeEditorCmd])
  //useHotkeys(shortcuts.select_all.join('+'), () => exeEditorCmd('select-all'), {}, [exeEditorCmd])

  return (
    <DropdownComponent
      id="header-edit-drop-down"
      className="w-48"
      buttonText="Edit"
      slot={
        <>
          <button
            data-testid="editor-header-undo-button"
            onClick={() => exeEditorCmd('undo')}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Undo</span>
            <span>{shortcuts.undo.join(' + ')}</span>
          </button>
          <button
            data-testid="editor-header-redo-button"
            onClick={() => exeEditorCmd('redo')}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Redo</span>
            <span>{shortcuts.redo.join(' + ')}</span>
          </button>
          <hr className="border-color" />
          <button
            data-testid="editor-header-cut-button"
            onClick={() => exeEditorCmd('cut')}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Cut</span>
            <span>{shortcuts.cut.join(' + ')}</span>
          </button>
          <button
            data-testid="editor-header-copy-button"
            onClick={() => exeEditorCmd('copy')}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Copy</span>
            <span>{shortcuts.copy.join(' + ')}</span>
          </button>
          <button
            data-testid="editor-header-paste-button"
            onClick={() => exeEditorCmd('paste')}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Paste</span>
            <span>{shortcuts.paste.join(' + ')}</span>
          </button>
          <hr className="border-color" />
          <button
            data-testid="editor-header-find-button"
            onClick={() => handleFind()}
            className="button-main w-full text-left px-2 py-1 flex justify-between"
          >
            <span>Find</span>
            <span>{shortcuts.find.join(' + ')}</span>
          </button>
        </>
      }
    />
  );
}

export default EditOptionsComponent;
