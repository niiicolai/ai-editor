import { useDispatch } from "react-redux";
import { setSearchVisible } from "../../features/editorSearch";
import DropdownComponent from "../utils/DropdownComponent";

function EditOptionsComponent() {
  const dispatch = useDispatch();

  return (
    <DropdownComponent
      id="header-edit-drop-down"
      className="w-48"
      buttonText="Edit"
      slot={
        <>
          <button
            onClick={() => console.log("not implemented")}
            className="button-main w-full text-left px-2 py-1"
          >
            Undo
          </button>
          <button
            onClick={() => console.log("not implemented")}
            className="button-main w-full text-left px-2 py-1"
          >
            Redo
          </button>
          <hr className="border-color" />
          <button
            onClick={() => console.log("not implemented")}
            className="button-main w-full text-left px-2 py-1"
          >
            Cut
          </button>
          <button
            onClick={() => console.log("not implemented")}
            className="button-main w-full text-left px-2 py-1"
          >
            Copy
          </button>
          <button
            onClick={() => console.log("not implemented")}
            className="button-main w-full text-left px-2 py-1"
          >
            Paste
          </button>
          <hr className="border-color" />
          <button
            onClick={() => dispatch(setSearchVisible(true))}
            className="button-main w-full text-left px-2 py-1"
          >
            Find
          </button>
        </>
      }
    />
  );
}

export default EditOptionsComponent;
