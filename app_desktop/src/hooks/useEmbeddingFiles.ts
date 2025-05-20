import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateEmbeddedFile,
} from "./useEmbeddedFile";
import { RootState } from "../store";
import { useState } from "react";
import { useIgnoreAi } from "./useIgnoreAi";
import { useHash } from "./useHash";
import { useReadFile } from "./useReadFile";
import { useParseFileContent } from "./useParseFileContent";
import EmbeddingService from "../services/embeddingService";
import { useProjectIndexFile } from "./useProjectIndexFile";
import { setMeta, setQueue } from "../features/projectIndex";
import { insertEmbeddedFile } from "../electron/insertEmbeddedFile";
import LlmService from "../services/llmService";

export const useEmbeddingFiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { embeddingModel, chunkMode } = useSelector((state: RootState) => state.userAgentSession);
  const { queue, meta } = useSelector((state: RootState) => state.projectIndex);
  const { currentPath } = useSelector((state: RootState) => state.hierarchy);

  const updateEmbeddedFile = useUpdateEmbeddedFile();
  const projectIndex = useProjectIndexFile();
  const ignoreAi = useIgnoreAi();
  const hashing = useHash();
  const readFile = useReadFile();
  const parseFile = useParseFileContent();
  const dispatch = useDispatch();

  const synchronize = async () => {
    console.log(queue);
    if (queue.length == 0) return;

    setIsLoading(true);

    try {
      const { _id: project_id } = await projectIndex.writeOrRead(
        currentPath as string
      );

      if (!meta?._id != project_id) {
        dispatch(setMeta({ name: currentPath as string, _id: project_id }));
      }

      for (const f of queue) {
        const fileInstance = await readFile.read(f);
        const content = fileInstance?.content || "";
        const language = fileInstance?.language || "plaintext";
        let description = '';

        if (chunkMode === 'custom_code') {
          const parsed = parseFile.parse(content, language);
          description = `
          filename: ${f.name}\n
          filepath: ${f.path}\n
          language: ${language}\n
          lines: ${parsed?.lines}\n
          description: ${parsed?.description}
          ${parsed?.vars && parsed?.vars?.length ? `\vars: ${JSON.stringify(parsed?.vars || "[]")}` : '' }
          ${parsed?.functions && parsed?.functions?.length ? `\functions: ${JSON.stringify(parsed?.functions || "[]")}` : '' }
          ${parsed?.classes && parsed?.classes?.length ? `\nclasses: ${JSON.stringify(parsed?.classes || "[]")}` : '' }
          ${parsed?.comments && parsed?.comments?.length ? `\comments: ${JSON.stringify(parsed?.comments || "[]")}` : '' }`;
        } else if (chunkMode === 'language_model_augmentation') {
          const llmContent = await LlmService.create({ event: chunkMode, messages: [
            { role: 'user', content: `You are a describing code file for a RAG application.\nYou must max use 250 characters.\nfilename: ${f.name}\nfilepath: ${f.path}\nlanguage: ${language}\n\nHere is the code:\n${content}`}
          ]})
          console.log(llmContent)
          description = llmContent.content.message;
        } else {
          console.error('(useEmbeddingFiles): Chunk mode is not supported')
        }

        const hash = hashing.hash(description);
        const embeddings = await EmbeddingService.create({ chunks: [description], model: embeddingModel });

        await insertEmbeddedFile({
          project_id,
          filepath: f.path,
          filename: f.name,
          description,
          hash,
          embedding: embeddings[0].embedding,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      dispatch(setQueue([]));
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { synchronize, isLoading, error };
};
