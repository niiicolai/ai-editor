
import useWebSocket, { ReadyState } from 'react-use-websocket';
import TokenService from '../services/tokenService';
import { useEffect } from 'react';

import userInputReplyEvent from '../websocket_events/user_input_reply';
import userInputReplyUpdateEvent from '../websocket_events/user_input_reply_update';
import sessionOperationEvent from '../websocket_events/session_operation';
import errorEvent from '../websocket_events/error';

const WS_URL = import.meta.env.VITE_AGENT_WS_API;
if (!WS_URL) console.error('CONFIGURATION ERROR(useWebsocket.ts): VITE_AGENT_WS_API should be set in the .env file');

export const useWebsocket = (sessionId: string) => {
    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, { protocols: "echo-protocol" });
    const userInputReply = userInputReplyEvent();
    const userInputReplyUpdate = userInputReplyUpdateEvent();
    const sessionOperation = sessionOperationEvent();    
    const onError = errorEvent();  

    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            if (json.event == "user_input_reply") userInputReply.execute(json);
            if (json.event == "user_input_reply_update") userInputReplyUpdate.execute(json, (m: string) => sendMessage(m));
            else if (json.event == "session_operation") sessionOperation.execute(json);
            else if (json.event == "error") onError.execute(json);
        }

        sendMessage(JSON.stringify({ 'event': 'session_connect', 'data': { sessionId, token: TokenService.getToken() } }));
    }, [lastMessage, sessionId]);

    const leaveSession = () => {
        sendMessage(JSON.stringify({ 'event': 'session_leave', 'data': { sessionId } }));
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return {
        sendMessage,
        lastMessage,
        leaveSession,
        connectionStatus
    }
}