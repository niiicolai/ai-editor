
import useWebSocket, { ReadyState } from 'react-use-websocket';
import TokenService from '../services/tokenService';
import { useState, useEffect } from 'react';

import userInputReplyEvent from '../websocket_events/user_input_reply';
import userInputReplyUpdateEvent from '../websocket_events/user_input_reply_update';
import sessionOperationEvent from '../websocket_events/session_operation';

export const useWebsocket = (sessionId: string) => {
    const [messageHistory] = useState<any>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:4001', { protocols: "echo-protocol" });
    const userInputReply = userInputReplyEvent();
    const userInputReplyUpdate = userInputReplyUpdateEvent();
    const sessionOperation = sessionOperationEvent();    

    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            if (json.event == "user_input_reply") userInputReply.execute(json);
            if (json.event == "user_input_reply_update") userInputReplyUpdate.execute(json, (m: string) => sendMessage(m));
            else if (json.event == "session_operation") sessionOperation.execute(json);
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
        messageHistory,
        connectionStatus
    }
}