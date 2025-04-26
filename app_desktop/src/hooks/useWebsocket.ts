import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useTerminal } from './useTerminal';
import { useFiles } from './useFiles';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import TokenService from '../services/tokenService';
import { useDispatch } from 'react-redux';
import { addMessage, setOperation } from '../features/userAgentSession';
import { UserAgentSessionMessageType } from '../types/userAgentSessionMessageType';
import { UserAgentSessionOperationType } from '../types/userAgentSessionOperationType';


export const useWebsocket = (sessionId: string) => {
    const terminal = useTerminal();
    const files = useFiles();
    const [messageHistory, setMessageHistory] = useState<any>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:4001', { protocols: "echo-protocol" });
    const queryClient = useQueryClient();
    const dispatch = useDispatch();


    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            if (json.event == "user_input_reply") {
                const clientFn = json.payload?.clientFn;

                if (clientFn?.name == 'Search_File_Content') {
                    const parsedArgs = JSON.parse(JSON.parse(json.payload?.response?.clientFn?.args));
                    terminal.executeTerminalCommand(`powershell -Command "Get-ChildItem -Path '${parsedArgs.path}' -Recurse -Include *.js -File | Where-Object { -not $_.FullName.Contains('node_modules') } | Select-String -Pattern '${parsedArgs.pattern}'"`)
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

                } else if (clientFn?.name == 'Read_File') {
                    const parsedArgs = JSON.parse(JSON.parse(clientFn?.args));
                    files.readFile(parsedArgs.path)
                        .then((resultContent: any) => {
                            console.log(resultContent)
                            sendMessage(JSON.stringify({
                                event: 'client_function_result',
                                data: {
                                    content: resultContent?.trim()?.length > 0
                                        ? 'The function result is: ' + resultContent
                                        : 'The read file gave no result. Please try another path.',
                                }
                            }));
                        })
                } else if (clientFn?.name == 'Write_File') {
                    const parsedArgs = JSON.parse(JSON.parse(clientFn?.args));
                    files.writeFile(parsedArgs.path, parsedArgs.content)
                        .then((resultContent: any) => {
                            console.log(resultContent)
                            sendMessage(JSON.stringify({
                                event: 'client_function_result',
                                data: {
                                    content: resultContent?.trim()?.length > 0
                                        ? 'The function result is: ' + resultContent
                                        : 'The write file gave no result. Please try another path.',
                                }
                            }));
                        })

                } else if (clientFn?.name == 'List_Directory') {
                    const parsedArgs = JSON.parse(JSON.parse(clientFn?.args));
                    terminal.executeTerminalCommand(
                        `powershell -Command "Get-ChildItem -Path '${parsedArgs.path}' -Recurse -File | Where-Object { -not $_.FullName.Contains('node_modules') } | Select-Object FullName"`
                    ).then((resultContent: any) => {
                        console.log(resultContent);
                        sendMessage(JSON.stringify({
                            event: 'client_function_result',
                            data: {
                                content: resultContent?.trim()?.length > 0
                                    ? 'The function result is:\n' + resultContent
                                    : 'No files were found. Please check the path or try another directory.',
                            }
                        }));
                    });

                }

                dispatch(addMessage(json.payload as UserAgentSessionMessageType));
            } else if (json.event == "session_operation") {
                dispatch(setOperation(json.payload as UserAgentSessionOperationType));
            }
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