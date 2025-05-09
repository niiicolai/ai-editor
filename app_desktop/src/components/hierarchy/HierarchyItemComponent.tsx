import { ChevronRight, Folder, File } from "lucide-react";
import { FileItemType } from "../../types/directoryInfoType";
import { useSelectFile } from "../../hooks/useSelectFile";
import { useDispatch } from "react-redux";
import { setInspectorMenu } from "../../features/hierarchy";
import HierarchyNewComponent from "./HierarchyNewComponent";
import HierarchyRenameComponent from "./HierarchyRenameComponent";

interface HierarchyComponentProps {
  file: FileItemType;
  level: number;
  currentFile: FileItemType | null;
  getIsOpen: (file: FileItemType) => boolean;
  getChildren: (file: FileItemType) => FileItemType[];
  renameFileItem: FileItemType | null;
}

function HierarchyItemComponent({
  file,
  level,
  currentFile,
  getIsOpen,
  getChildren,
  renameFileItem,
}: HierarchyComponentProps) {
  const dispatch = useDispatch();
  const selectFile = useSelectFile();
  const children = getChildren(file);
  const isOpen = getIsOpen(file);
  const hasChildren = children.length > 0;
  const isEditing = renameFileItem?.path === file.path;

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    dispatch(
      setInspectorMenu({
        x: event.pageX - 150,
        y: event.pageY,
        file,
      })
    );
  };

  return (
    <div>
      {isEditing && <HierarchyRenameComponent path={file.path} name={file.name} />}
      {!isEditing && (
        <div
          onContextMenu={handleContextMenu}
          className={`file-item flex items-center justify-between highlight-color p-1 hover:bg-gray-800 cursor-pointer text-sm ${
            currentFile?.path === file.path ? "bg-gray-800" : ""
          }`}
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => selectFile.select(file)}
        >
          <span className="flex items-center file-item">
            {file.isDirectory && (
              <>
                <ChevronRight
                  className={`w-4 h-4 mr-2 transition-transform file-item ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
                <Folder className="w-4 h-4 mr-2 file-item" />
              </>
            )}

            {!file.isDirectory && <File className="w-4 h-4 mr-2 file-item" />}

            <span className="file-item">{file.name}</span>
          </span>
        </div>
      )}

      {isOpen && (
        <div>
          <HierarchyNewComponent path={file.path} />

          {hasChildren && (
            <>
              {children.map((child) => (
                <HierarchyItemComponent
                  key={child.path}
                  file={child}
                  level={level + 1}
                  renameFileItem={renameFileItem}
                  currentFile={currentFile}
                  getIsOpen={getIsOpen}
                  getChildren={getChildren}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default HierarchyItemComponent;
