import { useEffect, useState } from "react";
import { Check, FileIcon, Folder, Loader, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FocusFileItemType } from "../../types/directoryInfoType";
import { useFocusFiles } from "../../hooks/useFocusFiles";
import { useGetAvailableLlms } from "../../hooks/useAvailableLlm";
import { AvailableLlmType } from "../../types/availableLlmType";
import { useRagSearch } from "../../hooks/useRagSearch";
import { useAutoEvaluation } from "../../hooks/useAutoEvaluation";

const ENV = import.meta.env.VITE_ENV || "development";

const actions = [
    ...(ENV !== 'production' ? [{ label: 'rag_test', value: 'rag_test' }] : []),
    { label: 'ask', value: 'input_ask' },
    { label: 'agent', value: 'input_agent' },
];

function ChatInputComponent({
    sendMessage
}: {
    sendMessage: (content:string) => void;
}) {
    const { meta } = useSelector((state: RootState) => state.projectIndex);
    const { embeddingModel, chunkMode, searchMode, autoEvaluation } = useSelector((state: RootState) => state.rag);
    const { sessionId } = useSelector((state: RootState) => state.userAgentSession);
    const { currentFile, directoryState, currentPath } = useSelector((state: RootState) => state.hierarchy);
    const { focusFiles, removeFocusFile } = useFocusFiles();
    const { data: llms } = useGetAvailableLlms(1, 10);
    const [formError, setFormError] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [selectedLlm, setSelectedLlm] = useState("");
    const [selectedAction, setSelectedAction] = useState(actions[0].value);
    const ragSearch = useRagSearch();
    const autoEval = useAutoEvaluation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!content) return setFormError("message is required");
        const embeddedFiles = await ragSearch.search([content]);

        try {
            sendMessage(JSON.stringify({
                event: selectedAction,
                data: {
                    content,
                    embeddedFiles,
                    currentFile,
                    focusFiles,
                    directoryInfo: directoryState,
                    user_agent_session_id: sessionId,
                    selected_llm: selectedLlm,
                    ...(meta?._id && { projectIndexId: meta?._id }),
                    embeddingModel, 
                    chunkMode, 
                    searchMode
                }
            }));
            setContent("");
        } catch (err) {
            setFormError(err as string);
        }
    }

    useEffect(() => {
        if (llms?.llms && llms?.llms.length > 0) setSelectedLlm(llms.llms[0].name);
    }, [llms])

    return (
        <div className="main-bgg border-r border-color p-1 main-color">
            {formError && (
                <div>{formError}</div>
            )}

            <div className={`text-xs flex flex-wrap gap-2 ${
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
            
            <form onSubmit={handleSubmit} className="flex gap-1 h-8">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                    className="input-main rounded-md border border-color flex-1 p-2 text-sm rounded-md focus:outline-none"
                />
                <button
                    type="submit"
                    className="button-main rounded-md border border-color  px-2 py-1 cursor-pointer focus:outline-none"
                >
                    {ragSearch.isLoading
                    ? <span className="flex flex-col items-center justify-center w-4 h-4 highlight-color"><Search className="w-2 h-2 animate-ping" /></span>
                    : <Check className="h-4 w-4" />}
                </button>
                {selectedAction === 'rag_test' && (
                    <button
                        onClick={() => autoEval.execute(selectedAction, selectedLlm, sendMessage)}
                        type="button"
                        className="button-main rounded-md border border-color  px-2 py-1 cursor-pointer focus:outline-none"
                    >                    
                        {autoEval.activeRef.current 
                            ? <div className="flex gap-1 items-center">
                                <Loader className="w-4 h-4 animate-spin" />
                                <span>{autoEval.questionNoRef.current}/{autoEvaluation.questions.length}</span>
                                </div>
                            : 'Auto RAG Test'
                        }
                    </button>
                )}
            </form>

            

            <div className={`text-xs flex gap-1 mt-1`}>
                <select
                    className="input-main border border-color px-1 text-xs rounded-md focus:outline-none"
                    onChange={(e) => setSelectedAction(e.target.value)}
                >
                    {actions.map((a: { label: string, value: string }) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                </select>
                <select
                    className="flex-1 input-main border border-color px-1 text-xs rounded-md focus:outline-none"
                    onChange={(e) => setSelectedLlm(e.target.value)}
                >
                    {llms?.llms?.map((a: AvailableLlmType) => (
                        <option key={a._id} value={a.name}>{a.name}: {a.description}</option>
                    ))}
                </select>
            </div>
        </div >
    );
}

export default ChatInputComponent;
