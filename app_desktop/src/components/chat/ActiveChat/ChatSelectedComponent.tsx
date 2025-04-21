import ChatMessagesComponent from "./ChatMessagesComponent";
import ChatInputComponent from "./ChatInputComponent";
import CreditInfoComponent from "./CreditInfoComponent";
import { DirectoryInfoType, FileType } from "../../../types/directoryInfoType";
import { Computer, User } from "lucide-react";
import { useExternalBrowser } from "../../../hooks/useExternalBrowser";
import { useWebsocket } from "../../../hooks/useWebsocket";

interface ChatShowComponentProps {
    sessionId: string;
    toggleSessions: () => void;
    currentFile: FileType;
    directoryInfo: DirectoryInfoType;
}

function ChatSelectedComponent(props: ChatShowComponentProps) {
    const externalBrowser = useExternalBrowser();
    const openInBrowser = (url: string) => externalBrowser.openExternalBrowser(url);
    const { leaveSession, messageHistory, connectionStatus, lastMessage, sendMessage } = useWebsocket(props.sessionId);
    const handleToggleSessions = () => {
        props.toggleSessions();
        leaveSession();
    }

    return (
        <>
            {/* Header */}
            <div className="h-12 border-b border-r border-color main-bgg text-white">
                <div className="flex items-center justify-between">
                    <h2 className="p-3 text-sm font-medium highlight-color"><Computer className="w-4 h-4" /></h2>

                    <CreditInfoComponent />

                    <div className="p-3 flex gap-1">
                        <button
                            onClick={() => openInBrowser("http://localhost:5173/user")}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <User className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleToggleSessions()}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <ChatMessagesComponent sessionId={props.sessionId} />
            {connectionStatus == 'Open' && (
                <ChatInputComponent
                    sendMessage={sendMessage}
                    sessionId={props.sessionId}
                    currentFile={props.currentFile}
                    directoryInfo={props.directoryInfo}
                />
            )}
            {connectionStatus == 'Connecting' && (
                <div className="h-12 flex items-center justify-center border-r border-color">
                    Connecting...
                </div>
            )}
            {connectionStatus == 'Closed' && (
                <div className="h-12 flex items-center justify-center border-r border-color">
                    Connection is closed.
                </div>
            )}
        </>
    )
}

export default ChatSelectedComponent;
