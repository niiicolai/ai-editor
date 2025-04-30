import { useState } from "react";
import { Check } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

function ChatInputComponent({
    sendMessage
}: {
    sendMessage: (content:string) => void;
}) {
    const { sessionId } = useSelector((state: RootState) => state.userAgentSession);
    const { currentFile, directoryState } = useSelector((state: RootState) => state.hierarchy);
    const [formError, setFormError] = useState<string | null>(null);
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!content) return setFormError("message is required");

        try {
            sendMessage(JSON.stringify({
                event: 'user_input',
                data: {
                    content,
                    currentFile,
                    directoryInfo: directoryState,
                    user_agent_session_id: sessionId
                }
            }));
            setContent("");
        } catch (err) {
            setFormError(err as string);
        }
    }

    return (
        <div className="main-bgg border-r border-color h-8">
            {formError && (
                <div>{formError}</div>
            )}
            <form onSubmit={handleSubmit} className="flex h-full p-1">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                    className="input-main flex-1 border-0 p-2 text-sm rounded-md focus:outline-none focus:border-transparent"
                />
                <button
                    type="submit"
                    className="button-main px-2 py-1 cursor-pointer focus:outline-none"
                >
                    <Check className="h-4 w-4" />
                </button>
            </form>
        </div >
    );
}

export default ChatInputComponent;
