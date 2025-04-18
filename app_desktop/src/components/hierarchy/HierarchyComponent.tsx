import { useState, useEffect } from 'react';
import { ChevronRight, Folder, File, Loader2 } from 'lucide-react';
import { useFiles } from '../../hooks/useFiles';
import CreditInfoComponent from "../CreditInfoComponent";

export interface FileItem {
    name: string;
    path: string;
    isDirectory: boolean;
}

export interface DirectoryState {
    [path: string]: {
        isOpen: boolean;
        files: FileItem[];
    };
}

interface HierarchyComponentProps {
    getFileContent: (fileName: string, content: string) => void;
    onDirectoryStateChange: (state: { currentPath: string | null, directoryState: DirectoryState }) => void;
}

function HierarchyComponent({ getFileContent, onDirectoryStateChange }: HierarchyComponentProps) {
    const { useOpenFolder, readDirectory, readFile } = useFiles();
    const [currentPath, setCurrentPath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [directoryState, setDirectoryState] = useState<DirectoryState>({});

    // Open folder query
    const { refetch: openFolder, isFetching: isOpeningFolder } = useOpenFolder();

    const loadDirectory = async (path: string) => {
        setIsLoading(true);
        try {
            const directoryFiles = await readDirectory(path);
            const newDirectoryState = {
                ...directoryState,
                [path]: {
                    isOpen: true,
                    files: directoryFiles
                }
            };
            setDirectoryState(newDirectoryState);
            onDirectoryStateChange({ currentPath: path, directoryState: newDirectoryState });
        } catch (error) {
            console.error('Error reading directory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentPath) {
            loadDirectory(currentPath);
        }
    }, [currentPath]);

    const handleOpenFolder = async () => {
        const result = await openFolder();
        if (result.data) {
            setCurrentPath(result.data);
        }
    };

    const handleFileSelect = async (file: FileItem) => {
        if (file.isDirectory) {
            if (!directoryState[file.path]) {
                loadDirectory(file.path);
            } else {
                const newDirectoryState = {
                    ...directoryState,
                    [file.path]: {
                        ...directoryState[file.path],
                        isOpen: !directoryState[file.path].isOpen
                    }
                };
                setDirectoryState(newDirectoryState);
                onDirectoryStateChange({ currentPath, directoryState: newDirectoryState });
            }
        } else {
            setIsLoading(true);
            try {
                const content = await readFile(file.path);
                getFileContent(file.name, content || '');
            } catch (error) {
                console.error('Error reading file:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderFileItem = (file: FileItem, level: number = 0) => {
        const isOpen = directoryState[file.path]?.isOpen;
        const hasChildren = file.isDirectory && directoryState[file.path]?.files.length > 0;

        return (
            <div key={file.path}>
                <div
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    style={{ paddingLeft: `${level * 20}px` }}
                    onClick={() => handleFileSelect(file)}
                >
                    {file.isDirectory ? (
                        <>
                            <ChevronRight
                                className={`w-4 h-4 mr-2 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                            />
                            <Folder className="w-4 h-4 mr-2" />
                        </>
                    ) : (
                        <File className="w-4 h-4 mr-2" />
                    )}
                    <span>{file.name}</span>
                </div>
                {isOpen && hasChildren && (
                    <div>
                        {directoryState[file.path].files.map(child => renderFileItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-screen w-64 border-r flex flex-col justify-between main-bgg text-white">
            <div>
                <div className="p-4">
                    <button
                        onClick={handleOpenFolder}
                        disabled={isOpeningFolder}
                        className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center"
                    >
                        {isOpeningFolder ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Open Folder
                    </button>
                </div>
                <div className="p-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    ) : currentPath && directoryState[currentPath]?.files.length > 0 ? (
                        directoryState[currentPath].files.map(file => renderFileItem(file))
                    ) : (
                        <div className="text-center text-gray-400 p-4">
                            No files found
                        </div>
                    )}
                </div>
            </div>
            <div className='p-3'>
                <CreditInfoComponent progressOnly={true} />
            </div>
        </div>
    );
}

export default HierarchyComponent;
