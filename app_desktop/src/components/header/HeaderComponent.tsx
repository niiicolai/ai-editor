import WindowOptionsComponent from "./WindowOptionsComponent";
import FileOptionsComponent from "./FileOptionsComponent";
import EditOptionsComponent from "./EditOptionsComponent";
import SelectionOptionsComponent from "./SelectionOptionsComponent";
import ViewOptionsComponent from "./ViewOptionsComponent";
import editorAvatar from '../../assets/editorAvatar.png';

function HeaderComponent() {
  return (
    <header className="p-2 border-color border-b main-bgg">
      <div className="flex gap-3 justify-between items-center">
        <div className="flex gap-4 justify-start items-center ">
          <div className="flex gap-3 items-center text-sm">
            <img src={editorAvatar} className="w-6" />
            <FileOptionsComponent />
            <EditOptionsComponent />
            <SelectionOptionsComponent />
            <ViewOptionsComponent />
          </div>
        </div>
        <div className="flex-1 h-full w-full p-1 secondary-bgg rounded-md draggable-region">
          <div className="main-color text-xs text-center">
            Palm Editor
          </div>
        </div>

        <div className="flex gap-1 justify-end items-center">
          <WindowOptionsComponent />
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
