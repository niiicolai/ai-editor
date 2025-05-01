import { useState } from "react";
import { Check, FileIcon, Folder } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FocusFileItemType } from "../../types/directoryInfoType";
import { useFocusFiles } from "../../hooks/useFocusFiles";

function ChatInputComponent({
    sendMessage
}: {
    sendMessage: (content:string) => void;
}) {
    const { sessionId } = useSelector((state: RootState) => state.userAgentSession);
    const { currentFile, directoryState, currentPath } = useSelector((state: RootState) => state.hierarchy);
    const { focusFiles, removeFocusFile } = useFocusFiles();
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
                    focusFiles,
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
        <div className="main-bgg border-r border-color p-1">
            {formError && (
                <div>{formError}</div>
            )}
            <div className={`text-xs flex gap-2 ${
                currentFile?.name || currentPath || focusFiles.length > 0
                ? 'mb-1' : ''
            }`}>
                {currentFile?.name && (
                    <div className="flex items-center gap-2 border border-color secondary-bgg p-1 max-w-36 overflow-hidden truncate ...">
                        <FileIcon className="w-3 h-3" /> 
                        <span>{currentFile?.name}</span>
                    </div>
                )}
                {currentPath && (
                    <div className="flex items-center gap-2 border border-color secondary-bgg p-1 max-w-36 overflow-hidden truncate ...">
                        <Folder className="w-3 h-3" /> 
                        <span>...{currentPath?.substring(currentPath?.length-15 || 0, currentPath?.length || 0)}</span>
                    </div>
                )}
                {focusFiles.map((focusFile: FocusFileItemType) => (
                    <button 
                    onClick={() => removeFocusFile(focusFile)}
                    key={focusFile.file.path} className="button-main flex items-center gap-2 border border-color secondary-bgg p-1 max-w-36 overflow-hidden truncate ...">
                        {focusFile.file.isDirectory
                        ? <Folder className="w-3 h-3" />
                        : <FileIcon className="w-3 h-3" />
                        }
                        <span>{focusFile.file.name?.substring(focusFile.file.name?.length-15 || 0, focusFile.file.name?.length || 0)}</span>
                        {focusFile?.lines && <span>Ln: {focusFile?.lines}</span>}
                    </button>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex h-8">
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
