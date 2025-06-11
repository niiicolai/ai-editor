import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Indent } from "lucide-react";
import { setTabSize } from "../../features/editor";
import DropdownComponent from "../utils/DropdownComponent";

function TabSizeOptionsComponent() {
  const tabSizes = [1, 2, 3, 4];
  const { tabSize } = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();
  const handleSetTabSize = (size: number) => {
    dispatch(setTabSize(size));
  };

  return (
    <div className="flex justify-start items-center gap-1">
      <Indent className="w-3.5 h-3.5" />
      <DropdownComponent
        id="footer-indent-drop-down"
        className="w-24 bottom-5"
        buttonText={`Tab size: ${tabSize}`}
        slot={
          <div className="flex flex-col gap-1">
            {tabSizes.map((size: number) => (
              <button
                key={size}
                data-testid={`editor-footer-tab-select-button-${size}`}
                onClick={() => handleSetTabSize(size)}
                className="button-main w-full text-left px-2 py-1 text-xs"
              >
                {size.toString()}
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}

export default TabSizeOptionsComponent;
