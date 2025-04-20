import { useState, useRef, useEffect } from "react";
import ChatComponent from "../components/chat/ChatComponent"
import HierarchyComponent from "../components/hierarchy/HierarchyComponent"
import EditorComponent from "../components/editor/EditorComponent"
import { FileType } from "../types/directoryInfoType";
import { DirectoryInfoType } from "../types/directoryInfoType";
import AuthorizedLayoutComponent from "../components/AuthorizedLayoutComponent";

function DashboardView() {
    const [currentFile, setCurrentFile] = useState<FileType>({
        id: "",
        name: "unkown",
        content: "",
        language: "javascript"
    });
    const [directoryInfo, setDirectoryInfo] = useState<DirectoryInfoType>({
        currentPath: null,
        directoryState: {}
    });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const displayRef = useRef<HTMLDivElement>(null);

    // Sync scroll positions between textarea and display
    useEffect(() => {
        const textarea = textareaRef.current;
        const display = displayRef.current;
        if (textarea && display) {
            const syncScroll = () => {
                display.scrollTop = textarea.scrollTop;
                display.scrollLeft = textarea.scrollLeft;
            };
            textarea.addEventListener('scroll', syncScroll);
            return () => textarea.removeEventListener('scroll', syncScroll);
        }
    }, [currentFile]);

    const getLanguageFromCurrentFile = (filename: string): string => {
        const extension = filename.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'js':
                return 'javascript';
            case 'ts':
                return 'typescript';
            case 'jsx':
                return 'javascript';
            case 'tsx':
                return 'typescript';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'scss':
            case 'sass':
                return 'scss';
            case 'json':
                return 'json';
            case 'md':
                return 'markdown';
            case 'py':
                return 'python';
            case 'java':
                return 'java';
            case 'c':
                return 'c';
            case 'cpp':
            case 'cc':
            case 'cxx':
                return 'cpp';
            case 'cs':
                return 'csharp';
            case 'go':
                return 'go';
            case 'rs':
                return 'rust';
            case 'rb':
                return 'ruby';
            case 'php':
                return 'php';
            case 'sh':
                return 'shell';
            case 'yaml':
            case 'yml':
                return 'yaml';
            case 'xml':
                return 'xml';
            default:
                return 'plaintext';
        }
    };

    const openFile = (name: string, content: string) => {
        const language = getLanguageFromCurrentFile(name);
        setCurrentFile({
            id: name,
            name,
            content,
            language
        });
    }

    const handleDirectoryStateChange = (newState: DirectoryInfoType) => {
        setDirectoryInfo(newState);
    }

    return (
        <AuthorizedLayoutComponent slot={
            <div className="flex flex-col lg:flex-row min-h-screen">
                <ChatComponent
                    currentFile={currentFile}
                    directoryInfo={directoryInfo}
                />
                <EditorComponent
                    content={currentFile.content}
                    language={currentFile.language}
                    onContentChange={(content: string) => setCurrentFile({
                        id: currentFile.id,
                        name: currentFile.name,
                        content,
                        language: currentFile.language
                    })}
                />
                <HierarchyComponent
                    getFileContent={openFile}
                    onDirectoryStateChange={handleDirectoryStateChange}
                />
            </div>
        } />
    );
}

export default DashboardView;
