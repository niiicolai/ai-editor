import ChatMessagesComponent from "./ChatMessagesComponent";
import ChatInputComponent from "./ChatInputComponent";

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

interface ChatShowComponentProps {
    sessionId: string;
    toggleSessions: () => void;
    currentFile: {
        id: string,
        name: string,
        content: string,
        language: string
    }
    directoryInfo: {
        currentPath: string | null;
        directoryState: DirectoryState;
    };
}

function ChatSelectedComponent(props: ChatShowComponentProps) {
    return (
        <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800 main-bgg text-white">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-100">AI Assistant</h2>
                    <button
                        onClick={() => props.toggleSessions()}
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-gray-200">Tell the AI what you need</p>
            </div>
            <ChatMessagesComponent sessionId={props.sessionId} />
            <ChatInputComponent 
                sessionId={props.sessionId} 
                currentFile={props.currentFile} 
                directoryInfo={props.directoryInfo} 
                />
        </>
    )
}

export default ChatSelectedComponent;
