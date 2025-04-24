import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import TokenService from '../services/tokenService';
import { useTerminal } from './useTerminal';
import { useFiles } from './useFiles';

export const useWebsocket = (sessionId: string) => {
    const terminal = useTerminal();
    const files = useFiles();
    const [messageHistory, setMessageHistory] = useState<any>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:4001', { protocols: "echo-protocol" });
    const queryClient = useQueryClient();


    useEffect(() => {
        if (lastMessage !== null) {
            const json = JSON.parse(lastMessage.data);
            if (json.event == "user_input_reply") {
                if (json.payload?.response?.clientFn?.name == 'Search_File_Content') {
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

                } else if (json.payload?.response?.clientFn?.name == 'Read_File') {
                    const parsedArgs = JSON.parse(JSON.parse(json.payload?.response?.clientFn?.args));
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
                } else if (json.payload?.response?.clientFn?.name == 'Write_File') {
                    const parsedArgs = JSON.parse(JSON.parse(json.payload?.response?.clientFn?.args));
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

                } else if (json.payload?.response?.clientFn?.name == 'List_Directory') {
                    const parsedArgs = JSON.parse(JSON.parse(json.payload?.response?.clientFn?.args));
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