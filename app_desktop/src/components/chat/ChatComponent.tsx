import ChatMessagesComponent from "./ChatMessagesComponent";
import ChatInputComponent from "./ChatInputComponent";
import CreditInfoComponent from "./CreditInfoComponent";
import { Computer, Info, ShoppingBag, User } from "lucide-react";
import { useExternalBrowser } from "../../hooks/useExternalBrowser";
import { useWebsocket } from "../../hooks/useWebsocket";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setSessionId } from "../../features/userAgentSession";

function ChatComponent() {
    const externalBrowser = useExternalBrowser();
    const sessionId = useSelector((state: RootState) => state.userAgentSession.sessionId);
    const openInBrowser = (url: string) => externalBrowser.openExternalBrowser(url);
    const { leaveSession, connectionStatus, sendMessage } = useWebsocket(sessionId || '');
    const dispatch = useDispatch();
    const handleToggleSessions = () => {
        dispatch(setSessionId(null));
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
                            onClick={() => openInBrowser("http://localhost:5173/docs")}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Info className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => openInBrowser("http://localhost:5173/products")}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag className="h-4 w-4" />
                        </button>
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
            <ChatMessagesComponent />

            {connectionStatus == 'Open' && (
                <ChatInputComponent sendMessage={sendMessage} />
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

export default ChatComponent;
