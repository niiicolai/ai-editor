import ChatMessagesComponent from "./ChatMessagesComponent";
import ChatInputComponent from "./ChatInputComponent";
import { useWebsocket } from "../../hooks/useWebsocket";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setSessionId, setSessionTitle } from "../../features/userAgentSession";
import { ChevronLeft, LoaderIcon, XIcon } from "lucide-react";
import { userAgentSessionSettingsActions } from "../../features/userAgentSessionSettings";

function ChatComponent() {
    const { sessionId, sessionTitle } = useSelector((state: RootState) => state.userAgentSession);
    const { leaveSession, connectionStatus, sendMessage } = useWebsocket(sessionId || '');
    const dispatch = useDispatch();

    const handleToggleSessions = () => {
        dispatch(setSessionId(null));
        dispatch(setSessionTitle(null));
        leaveSession();
    }

    return (
        <>
            <div className="border-b border-r border-color main-bgg text-white h-8">
                <div className="flex items-center justify-between p-1.5">
                    <div className="text-xs main-color pl-1 w-64 overflow-hidden truncate ... flex-1">
                        {sessionTitle}
                    </div>

                    <div className="flex gap-1 items-center justify-center">
                        <button
                            onClick={() => dispatch(userAgentSessionSettingsActions.setMinimized(true))}
                            className="items-center border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed hidden lg:inline-flex"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            data-testid="editor-user-sessions-close-button"
                            onClick={() => handleToggleSessions()}
                            className="inline-flex items-center border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <XIcon className="w-4 h-4" />
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
