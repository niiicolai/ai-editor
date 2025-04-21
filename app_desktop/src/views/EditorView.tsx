import { useState, useRef, useEffect, use } from "react";
import ChatComponent from "../components/chat/ChatComponent"
import HierarchyComponent from "../components/hierarchy/HierarchyComponent"
import EditorComponent from "../components/editor/EditorComponent"
import { FileType, TabType } from "../types/directoryInfoType";
import { DirectoryInfoType } from "../types/directoryInfoType";
import AuthorizedLayoutComponent from "../components/AuthorizedLayoutComponent";

function EditorView() {
    const [currentFile, setCurrentFile] = useState<FileType>({
        id: "",
        name: "new_file",
        content: "",
        language: "javascript"
    });
    const [tabs, setTabs] = useState<TabType[]>([{ file: currentFile }]);
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
            case 'mjs':
                return 'javascript';
            case 'cjs':
                return 'javascript';
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
        const file = {
            id: name,
            name,
            content,
            language
        };
        setCurrentFile(file);
        updateTabsOnFileOpen(file);
    }

    const updateTabsOnFileOpen = (file: FileType) => {
        if (tabs.length === 1 && tabs[0].file.name === "new_file" && tabs[0].file.content === "") {
            setTabs([{file}]);
            return;
        }
        for (const tab of tabs) {
            if (tab.file.name === file.name) {
                viewTab({ file })
                return;
            }
        }
        setTabs([{file},...tabs]);
    }

    const viewTab = (t: TabType) => {
        setCurrentFile(t.file);
    }

    const removeTab = (t: TabType) => {
        let i = 0;
        for (const tab of tabs) {
            if (tab.file.name === t.file.name) {
                tabs.splice(i, 1); // Remove the tab at index i
                break;
            }
            i++;
        }
        if (tabs.length === 0) {
            const dummyFile = {
                id: "",
                name: "new_file",
                content: "",
                language: "javascript"
            };
            setCurrentFile(dummyFile);
            setTabs([{ file: dummyFile }])
        } else {
            if (currentFile.name === t.file.name) setCurrentFile(tabs[0].file)
            setTabs([...tabs]);
        }
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
                    tabs={tabs}
                    removeTab={removeTab}
                    viewTab={viewTab}
                    currentFile={currentFile}
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

export default EditorView;
