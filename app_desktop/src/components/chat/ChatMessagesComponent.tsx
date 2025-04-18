import { useGetUserAgentSessionMessages } from "../../hooks/useUserAgentSessionMessage"
import { useState, useRef, useEffect } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Markdown from 'react-markdown';
import { Editor } from '@monaco-editor/react';

interface ChatMessagesComponentProps {
    sessionId: string;
}

function ChatMessagesComponent(props: ChatMessagesComponentProps) {
    const limit = 4;
    const [page, setPage] = useState(1);
    const [expandedBlocks, setExpandedBlocks] = useState<{ [key: string]: boolean }>({});
    const { data, isLoading, error } = useGetUserAgentSessionMessages(page, limit, props.sessionId);
    const messages = data?.messages
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const nextPage = () => { if (page < (data?.pages || 0)) setPage(page + 1); }
    const prevPage = () => { if (page > 1) setPage(page - 1); }

    const toggleBlock = (messageId: string, blockType: string) => {
        const key = `${messageId}-${blockType}`;
        setExpandedBlocks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-lg">Error loading messages</p>
                    <p className="text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col" style={{ height: "100px" }}>
            {/* Pagination Controls */}
            {data && data.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 main-bgg">
                    <button
                        onClick={prevPage}
                        disabled={page === 1}
                        className="cursor-pointer inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-100">
                        Page {page} of {data.pages}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={page >= data.pages}
                        className="cursor-pointer inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((message) => (
                    <div
                        key={message._id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex flex-col gap-2`}>
                            <div className={`rounded-lg px-4 py-2 ${message.role === 'user'
                                ? 'bg-gray-600 text-white'
                                : 'secondary-bgg text-gray-100 shadow-sm'
                                }`}>
                                <div className="flex items-start space-x-2">
                                    <div className="flex-shrink-0">
                                        {message.role === 'user' ? (
                                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                                <span className="text-white font-medium">U</span>
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">AI</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm whitespace-pre-wrap break-words">
                                            {message.content}
                                        </div>
                                        <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-200'
                                            }`}>
                                            {message.created_at}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {message.markdown && (
                                <div className="w-64">
                                    <button
                                        onClick={() => toggleBlock(message._id, 'markdown')}
                                        className="w-full text-left px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg flex items-center justify-between"
                                    >
                                        <span className="text-sm font-medium text-gray-100">Markdown</span>
                                        <span className="text-gray-500">
                                            {expandedBlocks[`${message._id}-markdown`] ? '▼' : '▶'}
                                        </span>
                                    </button>
                                    {expandedBlocks[`${message._id}-markdown`] && (
                                        <div className="mt-2 rounded-lg px-4 py-2 secondary-bgg shadow-sm">
                                            <Markdown>
                                                {message.markdown}
                                            </Markdown>
                                        </div>
                                    )}
                                </div>
                            )}

                            {message.code && (
                                <div className="w-64">
                                    <button
                                        onClick={() => toggleBlock(message._id, 'code')}
                                        className="w-full text-left px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg flex items-center justify-between"
                                    >
                                        <span className="text-sm font-medium text-gray-100">Code</span>
                                        <span className="text-gray-500">
                                            {expandedBlocks[`${message._id}-code`] ? '▼' : '▶'}
                                        </span>
                                    </button>
                                    {expandedBlocks[`${message._id}-code`] && (
                                        <div className="mt-2 rounded-lg bg-white shadow-sm">
                                            <Editor
                                                height="200px"
                                                defaultLanguage="typescript"
                                                value={message.code}
                                                theme="vs-light"
                                                options={{
                                                    minimap: { enabled: false },
                                                    fontSize: 12,
                                                    fontFamily: "'Fira Code', 'Fira Mono', monospace",
                                                    lineNumbers: "on",
                                                    roundedSelection: false,
                                                    scrollBeyondLastLine: false,
                                                    readOnly: true,
                                                    automaticLayout: true,
                                                    tabSize: 4,
                                                    folding: true,
                                                    foldingStrategy: "auto",
                                                    foldingHighlight: true,
                                                    showFoldingControls: "always",
                                                    foldingImportsByDefault: true,
                                                    renderLineHighlight: "none",
                                                    scrollbar: {
                                                        vertical: "visible",
                                                        horizontal: "visible"
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Empty State */}
            {messages?.length === 0 && (
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 mb-4">
                            <span className="text-2xl">💬</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-100 mb-2">
                            No messages yet
                        </h3>
                        <p className="text-sm text-gray-200">
                            Start a conversation with the AI assistant
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatMessagesComponent;
