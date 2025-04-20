
import { useCreateUserAgentSessionMessage } from "../../../hooks/useUserAgentSessionMessage";
import { DirectoryInfoType, FileType } from "../../../types/directoryInfoType";
import { useState } from "react";
import LoaderIcon from "../../../icons/LoaderIcon";
import { Check } from "lucide-react";

interface ChatMessagesComponentProps {
    sessionId: string;
    currentFile: FileType;
    directoryInfo: DirectoryInfoType;
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
                    {isPending ? <LoaderIcon h="h-4" w="w-4" /> : <Check className="h-4 w-4" /> }
                </button>
            </form>
        </div >
    );
}

export default ChatInputComponent;
