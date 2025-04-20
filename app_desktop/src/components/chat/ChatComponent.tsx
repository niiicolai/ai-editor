import { useState } from "react";
import { DirectoryInfoType, FileType } from "../../types/directoryInfoType";
import { UserAgentSessionType } from "../../types/userAgentSessionType";
import { useIsAuthorized } from "../../hooks/useUser";
import ChatSelectedComponent from "./ActiveChat/ChatSelectedComponent";
import ChatSessionsComponent from "./SessionList/ChatSessionsComponent";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Unlock } from "lucide-react";

interface ChatComponentProps {
    currentFile: FileType;
    directoryInfo: DirectoryInfoType;
}

function ChatComponent(props: ChatComponentProps) {
    const { data: isAuthorized } = useIsAuthorized();
    const [selectedSession, setSelectedSession] = useState<UserAgentSessionType | null>(null);
    const [showSessions, setShowSessions] = useState(true);
    const [isHidden, setIsHidden] = useState(false);

    if (!isAuthorized) {
        return (
            <div className="lg:h-screen lg:w-16 text-center relative main-bgg text-white gap-3 flex lg:flex-col items-center p-3 justify-end lg:border-r border-color">
                <Link title="Login" to="/user/login" className="button-main p-1 text-sm rounded-md"><Unlock className="w-4 h-4" /></Link>
            </div>
        )
    }

    if (isHidden) {
        return (
            <div className="lg:h-screen flex flex-col border-r border-color justify-center items-center main-bgg text-white p-1">
                <button
                    onClick={() => setIsHidden(false)}
                    className="inline-flex items-center border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className='w-4 h-4 hidden lg:block' />
                    <ChevronDown className='w-4 h-4 block lg:hidden' />
                </button>
            </div>
        );
    }

    if (showSessions) {
        return (
            <div className="h-screen w-96 relative main-bgg text-white flex flex-col justify-between">
                <ChatSessionsComponent
                    setSelectedSession={setSelectedSession}
                    setShowSessions={setShowSessions}
                    selectedSession={selectedSession}
                    setIsHidden={setIsHidden}
                />
            </div>
        )
    }

    return (
        <div className="h-screen w-96 relative main-bgg text-white">
            <div className="h-screen w-96 w-full flex-1 flex flex-col">
                {selectedSession && (
                    <ChatSelectedComponent
                        currentFile={props.currentFile}
                        directoryInfo={props.directoryInfo}
                        toggleSessions={() => setShowSessions(!showSessions)}
                        sessionId={selectedSession._id}
                    />
                )}

                {!selectedSession && (
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
        </div>
    );
}

export default ChatComponent;
