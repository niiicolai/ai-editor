import { useEffect, useState } from "react";
import { Check, FileIcon, Folder } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FocusFileItemType } from "../../types/directoryInfoType";
import { useFocusFiles } from "../../hooks/useFocusFiles";
import { useGetAvailableLlms } from "../../hooks/useAvailableLlm";
import { AvailableLlmType } from "../../types/availableLlmType";
import { useTextSearchQA, useVectorSearchQA } from "../../hooks/useQAFile";
import EmbeddingService from "../../services/embeddingService";

const actions = [
    { label: 'rag_test', value: 'rag_test' },
    { label: 'ask', value: 'input_ask' },
    { label: 'agent', value: 'input_agent' },
];

function ChatInputComponent({
    sendMessage
}: {
    sendMessage: (content:string) => void;
}) {
    const projectIndex = useSelector((state: RootState) => state.projectIndex);
    const { sessionId, embeddingModel, chunkMode, searchMode } = useSelector((state: RootState) => state.userAgentSession);
    const { currentFile, directoryState, currentPath } = useSelector((state: RootState) => state.hierarchy);
    const { focusFiles, removeFocusFile } = useFocusFiles();
    const { data: llms } = useGetAvailableLlms(1, 10);
    const [formError, setFormError] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [selectedLlm, setSelectedLlm] = useState("");
    const [selectedAction, setSelectedAction] = useState(actions[0].value);
    const vectorSearch = useVectorSearchQA();
    const textSearch = useTextSearchQA();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!content) return setFormError("message is required");

        const embeddedFiles = [];
        if (projectIndex?.meta?._id && searchMode === 'vector_search' ||
            projectIndex?.meta?._id && searchMode === 'hybrid_search'
        ) {
            const embeddingResult = await EmbeddingService.create({ chunks: [content], model: embeddingModel })
            const queryEmbedding = embeddingResult[0].embedding;
            const searchResponse = await vectorSearch.search(projectIndex.meta._id, queryEmbedding);
            const sortedResult = searchResponse?.result?.sort((a:any, b:any) => b.distance - a.distance);
            if (sortedResult) embeddedFiles.push(...sortedResult);
            else console.log('No vector search result', searchResponse, embeddingResult);
        }
        if (projectIndex?.meta?._id && searchMode === 'text_search' ||
            projectIndex?.meta?._id && searchMode === 'hybrid_search'
        ) {
            const searchResponse = await textSearch.search(projectIndex.meta._id, content);
            const searchResult = searchResponse?.result;
            console.log(searchResult)
            if (searchResult) embeddedFiles.push(...searchResult)
            else console.log('No text search result', searchResponse);
        }

        // filter duplicate embeddedFiles by rowid
        const uniqueEmbeddedFiles = embeddedFiles.filter(
            (file, index, self) =>
            file.rowid &&
            self.findIndex(f => f.rowid === file.rowid) === index
        ).map((ef) => ef.qa);

        try {
            sendMessage(JSON.stringify({
                event: selectedAction,
                data: {
                    content,
                    embeddedFiles: uniqueEmbeddedFiles,
                    currentFile,
                    focusFiles,
                    directoryInfo: directoryState,
                    user_agent_session_id: sessionId,
                    selected_llm: selectedLlm,
                    ...(projectIndex?.meta?._id && { projectIndexId: projectIndex?.meta?._id }),
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
        <div className="main-bgg border-r border-color p-1">
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
                    <Check className="h-4 w-4" />
                </button>
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
