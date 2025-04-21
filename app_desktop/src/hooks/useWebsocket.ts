import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import TokenService from '../services/tokenService';
import { useTerminal } from './useTerminal';

export const useWebsocket = (sessionId: string) => {
    const terminal = useTerminal();
    const [messageHistory, setMessageHistory] = useState<any>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:4001', { protocols: "echo-protocol" });
    const queryClient = useQueryClient();


    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            if (json.event == "user_input_reply") {
                if (json.payload?.response?.clientFn?.name == 'Search') {
                    
                    const stringified = JSON.stringify(json.payload?.response?.clientFn?.args);
                    const parsedArgs =JSON.parse(JSON.parse(json.payload?.response?.clientFn?.args));
                    console.log(parsedArgs)
                    terminal.executeTerminalCommand(`powershell -Command "Get-ChildItem -Path '${parsedArgs.path}' -Recurse -Include *.js -File | Where-Object { -not $_.FullName.Contains('node_modules') } | Select-String -Pattern '${parsedArgs.pattern ? `${parsedArgs.pattern}` : ''}'"`)
                        .then((resultContent: any) => {
                            console.log(resultContent)
                            sendMessage(JSON.stringify({
                                event: 'client_function_result',
                                data: {
                                    content: resultContent?.trim()?.length > 0 
                                        ? 'The function result is: ' + resultContent
                                        : 'The search gave no result. Please try another pattern.',
                                }
                            }));
                        })

                }
                queryClient.invalidateQueries({ queryKey: ['user_agent_session_messages'] });
                setMessageHistory((prev: any) => prev.concat(lastMessage));
            }
            console.log(json)
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