import WindowOptionsComponent from "./WindowOptionsComponent";
import FileOptionsComponent from "./FileOptionsComponent";
import EditOptionsComponent from "./EditOptionsComponent";
import SelectionOptionsComponent from "./SelectionOptionsComponent";
import ViewOptionsComponent from "./ViewOptionsComponent";

function HeaderComponent() {
  return (
    <header className="p-2 border-color border-b main-bgg">
      <div className="flex gap-3 justify-between items-center">
        <div className="flex gap-4 justify-start items-center ">
          <div className="flex gap-3 text-sm">
            <FileOptionsComponent />
            <EditOptionsComponent />
            <SelectionOptionsComponent />
            <ViewOptionsComponent />
          </div>
        </div>
        <div className="flex-1 h-full w-full p-3 secondary-bgg rounded-md draggable-region"></div>

        <div className="flex gap-1 justify-end items-center">
          <WindowOptionsComponent />
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
