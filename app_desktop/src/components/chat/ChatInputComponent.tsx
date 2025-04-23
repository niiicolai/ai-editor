import { useState } from "react";
import { Check } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ChatMessagesComponentProps {
    sendMessage: (content:string) => void;
}

function ChatInputComponent(props: ChatMessagesComponentProps) {
    const sessionId = useSelector((state: RootState) => state.userAgentSession.sessionId);
    const hierarchy = useSelector((state: RootState) => state.hierarchy);
    const [formError, setFormError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        try {
            props.sendMessage(JSON.stringify({
                event: 'user_input',
                data: {
                    content: newMessage,
                    currentFile: hierarchy.currentFile,
                    directoryInfo: hierarchy.directoryState,
                    user_agent_session_id: sessionId
                }
            }));
            setNewMessage("");
        } catch (err) {
            setFormError(err as string);
        }
    }

    return (
        <div className="main-bgg border-t border-r border-color h-12">
            {formError && (
                <div>{formError}</div>
            )}
            <form onSubmit={handleSubmit} className="flex h-full">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="input-main flex-1 border-0 px-4 py-1 focus:outline-none focus:border-transparent"
                />
                <button
                    type="submit"
                    className="button-main px-4 py-2 cursor-pointer focus:outline-none"
                >
                    <Check className="h-4 w-4" />
                </button>
            </form>
        </div >
    );
}

export default ChatInputComponent;
