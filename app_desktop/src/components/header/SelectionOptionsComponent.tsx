import DropdownComponent from "../utils/DropdownComponent";

function SelectionOptionsComponent() {

  return (
    <DropdownComponent
      id="header-selection-drop-down"
      className="w-48"
      buttonText="Selection"
      slot={
        <>
          <button
            onClick={() => console.log('not implemented')}
            className="button-main w-full text-left px-2 py-1"
          >
            Select All
          </button>
          <hr className="border-color" />
          <button
            onClick={() => console.log('not implemented')}
            className="button-main w-full text-left px-2 py-1"
          >
            Close Tab
          </button>
        </>
      }
    />
  );
}

export default SelectionOptionsComponent;
