import { useState, useRef, useEffect } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface File {
    id: string;
    name: string;
    content: string;
    language: string;
}

function DashboardView() {
    const [files, setFiles] = useState<File[]>([
        {
            id: '1',
            name: 'example.js',
            content: `function example() {
    // Your code here
    return "Hello, World!";
}`,
            language: 'javascript'
        },
        {
            id: '2',
            name: 'utils.js',
            content: `// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,
            language: 'javascript'
        },
        {
            id: '3',
            name: 'styles.css',
            content: `.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.button {
    background-color: #4f46e5;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
}`,
            language: 'css'
        }
    ]);

    const [currentFile, setCurrentFile] = useState<File>(files[0]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const displayRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your AI coding assistant. How can I help you today?",
            sender: "ai",
            timestamp: "10:00 AM"
        },
        {
            id: 2,
            text: "I need help with this code. Can you explain what it does?",
            sender: "user",
            timestamp: "10:01 AM"
        },
        {
            id: 3,
            text: "Of course! I see you have a simple function that returns 'Hello, World!'. Would you like me to help you enhance it or explain any specific part?",
            sender: "ai",
            timestamp: "10:01 AM"
        }
    ]);
    const [newMessage, setNewMessage] = useState("");

    // Sync scroll positions between textarea and display
    useEffect(() => {
        const textarea = textareaRef.current;
        const display = displayRef.current;
        if (textarea && display) {
            const syncScroll = () => {
                display.scrollTop = textarea.scrollTop;
                display.scrollLeft = textarea.scrollLeft;
            };
            textarea.addEventListener('scroll', syncScroll);
            return () => textarea.removeEventListener('scroll', syncScroll);
        }
    }, [currentFile]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setCurrentFile(prev => ({ ...prev, content: newContent }));
        setFiles(prev => prev.map(file => 
            file.id === currentFile.id ? { ...file, content: newContent } : file
        ));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const value = e.currentTarget.value;
            e.currentTarget.value = value.substring(0, start) + '    ' + value.substring(end);
            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
            handleCodeChange(e as any);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: messages.length + 1,
            text: newMessage,
            sender: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, message]);
        setNewMessage("");

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                text: "I understand. Let me help you with that. I can see the code in the editor and can provide specific guidance.",
                sender: "ai",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleFileSelect = (file: File) => {
        setCurrentFile(file);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen">
                {/* Chat Section - Left Side */}
                <div className="w-1/3 flex flex-col border-r border-gray-200">
                    {/* Chat Header */}
                    <div className="bg-white shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                        <span className="text-white font-medium">AI</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h2 className="text-lg font-medium text-gray-900">AI Coding Assistant</h2>
                                    <p className="text-sm text-gray-500">Online</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                        message.sender === 'user'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-900 shadow-sm'
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <p
                                        className={`text-xs mt-1 ${
                                            message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                                        }`}
                                    >
                                        {message.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="bg-white border-t border-gray-200 p-4">
                        <form onSubmit={handleSendMessage} className="flex space-x-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>

                {/* Code Editor Section - Right Side */}
                <div className="w-full flex">
                    {/* Code Editor */}
                    <div className="w-full flex-1 flex flex-col border-r border-gray-200">
                        {/* Code Editor Header */}
                        <div className="bg-white shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Code Editor</h2>
                                <p className="text-sm text-gray-500">Editing: {currentFile.name}</p>
                            </div>
                        </div>

                        {/* Code Editor with Syntax Highlighting */}
                        <div className="flex-1 overflow-auto bg-white p-4 relative">
                            {/* Syntax-highlighted display */}
                            <div
                                ref={displayRef}
                                className="absolute inset-0 w-full h-full font-mono text-sm p-4 overflow-auto"
                            >
                                <SyntaxHighlighter
                                    language={currentFile.language}
                                    style={docco}
                                    customStyle={{
                                        margin: 0,
                                        padding: 0,
                                        background: 'transparent'
                                    }}
                                >
                                    {currentFile.content}
                                </SyntaxHighlighter>
                            </div>
                            {/* Semi-transparent textarea for editing */}
                            <textarea
                                ref={textareaRef}
                                value={currentFile.content}
                                onChange={handleCodeChange}
                                onKeyDown={handleKeyDown}
                                className="absolute inset-0 w-full h-full font-mono text-sm p-4 bg-transparent text-transparent caret-black resize-none"
                                style={{ 
                                    caretColor: 'black',
                                    outline: 'none',
                                    border: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* File List */}
                    <div className="w-64 bg-gray-50 flex flex-col">
                        <div className="bg-white shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <h2 className="text-lg font-medium text-gray-900">Project: Name</h2>
                                        <p className="text-sm text-gray-500">Files</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {files.map((file) => (
                                <button
                                    key={file.id}
                                    onClick={() => handleFileSelect(file)}
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                                        currentFile.id === file.id
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="flex-shrink-0">
                                        {file.language === 'javascript' ? '📄' : '🎨'}
                                    </span>
                                    <span className="truncate">{file.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardView;
