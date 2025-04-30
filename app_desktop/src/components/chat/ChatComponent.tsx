import ChatMessagesComponent from "./ChatMessagesComponent";
import ChatInputComponent from "./ChatInputComponent";
import { useWebsocket } from "../../hooks/useWebsocket";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setSessionId } from "../../features/userAgentSession";
import { LoaderIcon } from "lucide-react";

function ChatComponent() {
    const sessionId = useSelector((state: RootState) => state.userAgentSession.sessionId);
    const { leaveSession, connectionStatus, sendMessage } = useWebsocket(sessionId || '');
    const dispatch = useDispatch();
    const handleToggleSessions = () => {
        dispatch(setSessionId(null));
        leaveSession();
    }

    return (
        <>
            {/* Header */}
            <div className="border-b border-r border-color main-bgg text-white h-8">
                <div className="flex items-center justify-end p-1.5">
                    <div className="flex gap-1 items-center justify-center">
                        <button
                            onClick={() => handleToggleSessions()}
                            className="inline-flex items-center border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <ChatMessagesComponent />

            {connectionStatus == 'Open' && (
                <ChatInputComponent sendMessage={sendMessage} />
            )}

            {connectionStatus == 'Connecting' && (
                <div className="h-12 flex items-center justify-center border-r border-color">
                    <LoaderIcon className="w-4 h-4" />
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

export default ChatComponent;
