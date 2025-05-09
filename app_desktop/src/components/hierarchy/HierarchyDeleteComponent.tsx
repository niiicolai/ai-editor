import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setDeleteFileItem } from "../../features/hierarchy";
import { useMoveItemToTrash } from "../../hooks/useMoveItemToTrash";
import { File, Folder, Loader } from "lucide-react";

function HierarchyDeleteComponent() {
  const hierarchy = useSelector((state: RootState) => state.hierarchy);
  const { trashItem, isLoading } = useMoveItemToTrash();
  const dispatch = useDispatch();
  const onCancel = () => {
    dispatch(setDeleteFileItem(null));
  };
  const onDelete = async () => {
    if (hierarchy?.deleteFileItem) {
      const file = hierarchy?.deleteFileItem;
      await trashItem(file.path, file.isDirectory);
      dispatch(setDeleteFileItem(null));
    }
  };

  return (
    <>
      {hierarchy.deleteFileItem && (
        <div
          className="fixed left-0 top-0 right-0 bottom-0 bg-black opacity-50"
          style={{
            zIndex: 9999,
          }}
        >
          <div
            className="fixed main-bgg main-color border-color border rounded shadow-lg w-64 h-36 left-0 top-0 right-0 bottom-0 mx-auto my-auto text-sm"
            style={{
              zIndex: 9999,
            }}
          >
            <div className="flex flex-col h-36">
              <p className="main-color p-3 border-b border-color text-xs text-center">
                Are you sure you want to move the following item to the trash?
              </p>
              <div className="flex justify-center items-center gap-3 text-sm p-3">
                {hierarchy?.deleteFileItem?.isDirectory ? (
                  <Folder className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )}
                <p className="text-xs text-gray-500">
                  {hierarchy?.deleteFileItem?.name}
                </p>
              </div>
              {isLoading && (
                <div className="flex justify-center items-center gap-3 text-xs p-3">
                  <p className="text-xs text-gray-500">Moving to trash...</p>
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              )}
              {!isLoading && (
              <div className="flex justify-center items-center gap-3 text-sm p-1">
                <button
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={onDelete}
                >
                  Delete
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HierarchyDeleteComponent;
