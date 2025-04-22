import { useState, useEffect } from 'react';
import { ChevronRight, Folder, File, Loader2, Plus, ChevronDown, ChevronUp, ChevronLeft, XIcon } from 'lucide-react';
import { useFiles } from '../../hooks/useFiles';
import { FileItemType, DirectoryStateType } from "../../types/directoryInfoType";
import Scrollbar from 'react-scrollbars-custom';

interface HierarchyComponentProps {
    getFileContent: (fileName: string, content: string, path: string) => void;
    onDirectoryStateChange: (state: { currentPath: string | null, directoryState: DirectoryStateType }) => void;
}

function HierarchyComponent({ getFileContent, onDirectoryStateChange }: HierarchyComponentProps) {
    const { useOpenFolder, readDirectory, readFile } = useFiles();
    const [isHidden, setIsHidden] = useState(false);
    const [currentPath, setCurrentPath] = useState<string | null>(null);
    const [currentFile, setCurrentFile] = useState<FileItemType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [directoryState, setDirectoryState] = useState<DirectoryStateType>({});

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

    const currentFolder = currentPath ? currentPath.split('\\').pop() || 'No Folder' : 'No Folder';

    const handleOpenFolder = async () => {
        const result = await openFolder();
        if (result.data) {
            setCurrentPath(result.data);
        }
    };

    const handleFileSelect = async (file: FileItemType) => {
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
                setCurrentFile(file);
                getFileContent(file.name, content || '', file.path);
            } catch (error) {
                console.error('Error reading file:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderFileItem = (file: FileItemType, level: number = 0) => {
        const isOpen = directoryState[file.path]?.isOpen;
        const hasChildren = file.isDirectory && directoryState[file.path]?.files.length > 0;

        return (
            <div key={file.path}>
                <div
                    className={`flex items-center justify-between p-1 hover:bg-gray-800 cursor-pointer text-sm ${currentFile?.path === file.path
                        ? "bg-gray-800"
                        : ""
                        }`}
                    style={{ paddingLeft: `${level * 20}px` }}
                    onClick={() => handleFileSelect(file)}
                >
                    <span className='flex items-center'>
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
                    </span>


                </div>
                {isOpen && hasChildren && (
                    <div>
                        {directoryState[file.path].files.map(child => renderFileItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (isHidden) {
        return (
            <div className="lg:h-screen flex flex-col justify-center items-center main-bgg text-white p-1">
                <button
                    onClick={() => setIsHidden(false)}
                    className="inline-flex items-center border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className='w-4 h-4 hidden lg:block' />
                    <ChevronDown className='w-4 h-4 block lg:hidden' />
                </button>
            </div>
        );
    }

    return (
        <div className="lg:h-screen h-64 lg:w-64 flex flex-col justify-between main-bgg text-white">

            <div className='flex items-center gap-3 hidden'>
                <h2>Options</h2>
                <Plus className='w-4 h-4' />
                <XIcon className='w-4 h-4' />
            </div>

            <Scrollbar className='w-full h-full'>
                <div>
                    <div className="p-3 border-b border-color h-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium highlight-color">{currentFolder}</h2>
                            <div className='flex gap-1'>
                                <button
                                    onClick={handleOpenFolder}
                                    disabled={isOpeningFolder}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isOpeningFolder ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : <Folder className='w-4 h-4' />}
                                </button>
                                <button
                                    onClick={() => setIsHidden(true)}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className='w-4 h-4 hidden lg:block' />
                                    <ChevronUp className='w-4 h-4 block lg:hidden' />
                                </button>
                            </div>
                        </div>
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
            </Scrollbar>

        </div>
    );
}

export default HierarchyComponent;
