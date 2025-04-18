import { useCreateUserAgentSessionMessage } from "../../hooks/useUserAgentSessionMessage"
import { useState } from "react";

export interface FileItem {
    name: string;
    path: string;
    isDirectory: boolean;
}

export interface DirectoryState {
    [path: string]: {
        isOpen: boolean;
        files: FileItem[];
    };
}

interface ChatMessagesComponentProps {
    sessionId: string;
    currentFile: {
        id: string,
        name: string,
        content: string,
        language: string
    }
    directoryInfo: {
        currentPath: string | null;
        directoryState: DirectoryState;
    };
}

function ChatInputComponent(props: ChatMessagesComponentProps) {
    const { mutateAsync, isPending } = useCreateUserAgentSessionMessage();
    const [formError, setFormError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        console.log("props.directoryInfo",props.directoryInfo)
        try {
            await mutateAsync({
                content: newMessage,
                currentFile: props.currentFile,
                directoryInfo: props.directoryInfo,
                user_agent_session_id: props.sessionId
            });
            setNewMessage("");
        } catch (err) {
            setFormError(err as string);
        }
    }

    return (
        < div className="secondary-bgg p-4" >
            {formError && (
                <div>{formError}</div>
            )}
            <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-gray-600 flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isPending ? 'Loading...' : 'Send' }
                </button>
            </form>
        </div >
    );
}

export default ChatInputComponent;
