import { useState } from "react";
import { UserAgentSessionType } from "../../types/userAgentSessionType";
import ChatSelectedComponent from "./ChatSelectedComponent";
import ChatSessionsComponent from "./ChatSessionsComponent";
import { DirectoryState } from "../hierarchy/HierarchyComponent";

interface ChatComponentProps {
    currentFile: {
        id: string,
        name: string,
        content: string,
        language: string
    };
    directoryInfo: {
        currentPath: string | null;
        directoryState: DirectoryState;
    };
}

function ChatComponent(props: ChatComponentProps) {
    const [selectedSession, setSelectedSession] = useState<UserAgentSessionType | null>(null);
    const [showSessions, setShowSessions] = useState(true);

    return (
        <div className="h-screen w-96 relative main-bgg text-white">
            {showSessions &&
                <ChatSessionsComponent 
                    setSelectedSession={setSelectedSession} 
                    setShowSessions={setShowSessions} 
                    selectedSession={selectedSession} 
                />
            }

            {!showSessions &&
                <div className="h-screen w-96 w-full flex-1 flex flex-col">
                    {selectedSession ? (
                        <ChatSelectedComponent 
                            currentFile={props.currentFile}
                            directoryInfo={props.directoryInfo}
                            toggleSessions={() => setShowSessions(!showSessions)} 
                            sessionId={selectedSession._id} 
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-100 mb-2">
                                    Select a Session
                                </h3>
                                <p className="text-sm text-gray-200">
                                    Choose a chat session from the sidebar
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}

export default ChatComponent;
