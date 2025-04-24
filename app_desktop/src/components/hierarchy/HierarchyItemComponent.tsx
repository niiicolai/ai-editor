import { ChevronRight, Folder, File } from 'lucide-react';
import { FileItemType } from "../../types/directoryInfoType";

interface HierarchyComponentProps {
    file: FileItemType;
    level: number;
    currentFile: FileItemType | null;
    handleFileSelect: (file: FileItemType) => void;
    getIsOpen: (file: FileItemType) => boolean;
    getChildren: (file: FileItemType) => FileItemType[];
}

function HierarchyItemComponent({ file, level, currentFile, handleFileSelect, getIsOpen, getChildren }: HierarchyComponentProps) {
    const children = getChildren(file);
    const isOpen = getIsOpen(file);
    const hasChildren = children.length > 0;

    return (
        <div>
            <div
                className={`flex items-center justify-between highlight-color p-1 hover:bg-gray-800 cursor-pointer text-sm ${currentFile?.path === file.path
                    ? "bg-gray-800"
                    : ""
                    }`}
                style={{ paddingLeft: `${level * 20}px` }}
                onClick={() => handleFileSelect(file)}
            >
                <span className='flex items-center'>
                    {file.isDirectory && (
                        <>
                            <ChevronRight className={`w-4 h-4 mr-2 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                            <Folder className="w-4 h-4 mr-2" />
                        </>
                    )}

                    {!file.isDirectory && (<File className="w-4 h-4 mr-2" />)}

                    <span>{file.name}</span>
                </span>
            </div>

            {isOpen && hasChildren && (
                <div>
                    {children.map(child => <HierarchyItemComponent 
                        key={child.path}
                        file={child} 
                        level={level + 1} 
                        handleFileSelect={handleFileSelect}
                        currentFile={currentFile} 
                        getIsOpen={getIsOpen} 
                        getChildren={getChildren} 
                    />)}
                </div>
            )}
        </div>
    );
}

export default HierarchyItemComponent;
