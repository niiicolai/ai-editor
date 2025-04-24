import SyntaxHighlighter from 'react-syntax-highlighter';
import Markdown from 'react-markdown';
import Scrollbar from "react-scrollbars-custom";
import { useGetUserAgentSessionMessages } from "../../hooks/useUserAgentSessionMessage"
import { useState, useRef, useEffect } from "react";
import { ChevronRight, Computer, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function ChatMessagesComponent() {
    const sessionId = useSelector((state: RootState) => state.userAgentSession.sessionId);
    const limit = 10;
    const [page, setPage] = useState(1);
    const [expandedBlocks, setExpandedBlocks] = useState<{ [key: string]: boolean }>({});
    const { data, isLoading, error } = useGetUserAgentSessionMessages(page, limit, sessionId || '');
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-color"></div>
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
        <div className="flex-1 flex flex-col border-r border-color" style={{ height: "100px" }}>
            {/* Pagination Controls */}
            {data && data.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 main-bgg text-xs">
                    <button
                        onClick={prevPage}
                        disabled={page === 1}
                        className="cursor-pointer inline-flex items-center px-3 py-1 font-medium rounded-md button-main disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="highlight-color">
                        Page {page} of {data.pages}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={page >= data.pages}
                        className="cursor-pointer inline-flex items-center px-3 py-1 font-medium rounded-md button-main disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

            {messages && messages?.length > 0 && (
                <Scrollbar style={{ height: 250 }} className='flex-1 w-full border-b border-color h-full text-sm text-white'>
                    <div className='p-2 space-y-2'>
                        {messages?.map((message) => (
                            <div
                                key={message._id}
                                className={`flex`}
                            >
                                <div className={`flex flex-col gap-2 w-full whitespace-pre-wrap break-words max-w-full overflow-x-hidden`}>
                                    <div className={`rounded-lg px-4 py-2 w-full ${message.role === 'user'
                                        ? 'bg-gray-600 text-white'
                                        : 'secondary-bgg text-gray-100 shadow-sm'
                                        }`}>
                                        <div className="flex items-start space-x-2">
                                            <div className="flex-shrink-0">
                                                {message.role === 'user' ? (
                                                    <div className="h-8 w-8 rounded-full highlight-bgg flex items-center justify-center">
                                                        <span className="text-white font-medium"><User className="w-4 h-4" /></span>
                                                    </div>
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium"><Computer className="w-4 h-4" /></span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs whitespace-pre-wrap break-words w-full overflow-hidden [&_p]:mb-0.1 [&_p]:w-64 [&_ol]:mb-0.1 [&_ol]:w-64 [&_ul]:mb-0.1 [&_ul]:w-64 [&_li]:mb-0.1 [&_li]:p-0.1 [&_li]:w-64 [&_pre]:w-64 [&_pre]:rounded-md [&_pre]:mb-0.1 [&_pre]:p-1 [&_pre]:border [&_pre]:overflow-x-auto [&_code]:w-64 [&_code]:overflow-x-auto">
                                                    <Markdown>{message.content}</Markdown>
                                                </div>
                                                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-200'
                                                    }`}>
                                                    {new Date(message.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {message.code && (
                                        <div className="w-full">
                                            <button
                                                onClick={() => toggleBlock(message._id, 'code')}
                                                className="w-full text-left px-4 py-2 button-main rounded-lg flex items-center justify-between"
                                            >
                                                <span className="text-sm font-medium text-gray-100">Code</span>
                                                <span className="text-gray-500">
                                                    {expandedBlocks[`${message._id}-code`] ? '▼' : '▶'}
                                                </span>
                                            </button>
                                            {expandedBlocks[`${message._id}-code`] && (
                                                <div className="mt-2 rounded-lg shadow-sm">
                                                    <SyntaxHighlighter style={dracula}>
                                                        {message.code}
                                                    </SyntaxHighlighter>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {message.clientFn && (
                                        <div className="w-full">
                                            <div className="rounded-lg  highlight-bgg border-color border-1 p-1 shadow-sm flex gap-1 overflow-hidden">
                                                <div><ChevronRight className="w-4 h-4 main-color mt-0.5" /></div>
                                                <div>
                                                    <div className="flex gap-1 main-color">
                                                        <p className="font-bold text-white">Function:</p>
                                                        <p className="text-white">{message.clientFn.name}</p>
                                                    </div>
                                                    <div className="flex gap-1 main-color">
                                                        <p className="font-bold text-white">Args:</p>
                                                        <p className="text-white">{message.clientFn.args}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </Scrollbar>
            )}

            {/* Empty State */}
            {messages?.length === 0 && (
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full highlight-bgg mb-4">
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
