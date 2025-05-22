import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";
import { useIgnoreAi } from "./useIgnoreAi";
import { useHash } from "./useHash";
import { useReadFile } from "./useReadFile";
import { useParseFileContent } from "./useParseFileContent";
import { useProjectIndexFile } from "./useProjectIndexFile";
import { setMeta, setQueue } from "../features/projectIndex";
import { insertEmbeddedFile } from "../electron/insertEmbeddedFile";
import { updateEmbeddedFile } from "../electron/updateEmbeddedFile";
import { findEmbeddedFileByFilepathAndProjectId } from "../electron/findEmbeddedFileByFilepathAndProjectId";
import LlmService from "../services/llmService";
import EmbeddingService from "../services/embeddingService";

export const useEmbeddingFiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { embeddingModel, chunkMode } = useSelector((state: RootState) => state.userAgentSession);
  const { queue, meta } = useSelector((state: RootState) => state.projectIndex);
  const { currentPath } = useSelector((state: RootState) => state.hierarchy);

  const projectIndex = useProjectIndexFile();
  const ignoreAi = useIgnoreAi();
  const hashing = useHash();
  const readFile = useReadFile();
  const parseFile = useParseFileContent();
  const dispatch = useDispatch();

  const describeFile = async (file: any, content:string, language:string) => {
    const { name, path } = file;

    if (chunkMode === 'custom_code') {
      const parsed = parseFile.parse(content, language);

      return `
        filename: ${name}\n
        filepath: ${path}\n
        language: ${language}\n
        lines: ${parsed?.lines}\n
        description: ${parsed?.description}
        ${parsed?.vars && parsed?.vars?.length ? `\nvars: ${JSON.stringify(parsed?.vars || "[]")}` : '' }
        ${parsed?.functions && parsed?.functions?.length ? `\nfunctions: ${JSON.stringify(parsed?.functions || "[]")}` : '' }
        ${parsed?.classes && parsed?.classes?.length ? `\nclasses: ${JSON.stringify(parsed?.classes || "[]")}` : '' }
        ${parsed?.comments && parsed?.comments?.length ? `\ncomments: ${JSON.stringify(parsed?.comments || "[]")}` : '' }`;
        
    } else if (chunkMode === 'language_model_augmentation') {
      const llmContent = await LlmService.create({ event: chunkMode, messages: [{ 
          role: 'user', 
          content: `You are a describing code file for a RAG application.\nYou must max use 250 characters.\nfilename: ${name}\nfilepath: ${path}\nlanguage: ${language}\n\nHere is the code:\n${content}`}
      ]})
      
      return llmContent.content.message;
    
    } else {
      throw new Error("(useEmbeddingFiles): Chunk mode is not supported");
    }
  }

  const synchronize = async () => {
    if (queue.length == 0) return;
    if (!currentPath) return;

    setIsLoading(true);

    try {
      const ignoreFile = await ignoreAi.read(currentPath);

      const { _id: project_id } = await projectIndex.writeOrRead(
        currentPath as string
      );

      if (!meta?._id != project_id) {
        dispatch(setMeta({ name: currentPath as string, _id: project_id }));
      }

      for (const file of queue) {
        const { name, path } = file;
        if (ignoreFile?.includes(name) ||
            ignoreFile?.includes(path)) {
          console.log('skip file specified in ignore file');
          continue;
        } 

        const fileInstance = await readFile.read(file);
        const content = fileInstance?.content || "";
        const language = fileInstance?.language || "plaintext";
        const hash = hashing.hash(`${path}:${content}:${project_id}`);

        const existingFile = await findEmbeddedFileByFilepathAndProjectId(path, project_id, embeddingModel);
        if (existingFile?.file && existingFile?.file?.hash === hash) {
          console.log('skip unchanged existing file');
          continue;
        } 

        const description = await describeFile(file, content, language);
        const embeddings = await EmbeddingService.create({ chunks: [description], model: embeddingModel });
        const data = {
          project_id,
          filepath: path,
          filename: name,
          description,
          hash,
          embedding: embeddings[0].embedding,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (existingFile?.file) {
          console.log('updating file', data)
          await updateEmbeddedFile(existingFile?.file?.rowid, data, embeddingModel);
        } else {
          console.log('inserting file', data)
          await insertEmbeddedFile(data, embeddingModel);
        }
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
