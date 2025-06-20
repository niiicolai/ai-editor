import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";
import { useIgnoreAi } from "./useIgnoreAi";
import { useHash } from "./useHash";
import { useReadFile } from "./useReadFile";
import { useProjectIndexFile } from "./useProjectIndexFile";
import { setMeta, setQueue } from "../features/projectIndex";
import { insertEmbeddedFile } from "../electron/insertEmbeddedFile";
import { updateEmbeddedFile } from "../electron/updateEmbeddedFile";
import { insertQA } from "../electron/insertQA";
import { deleteAllQAByFileId } from "../electron/deleteAllQAByFileId";
import { findEmbeddedFileByFilepathAndProjectId } from "../electron/findEmbeddedFileByFilepathAndProjectId";
import { parseCustomCode } from "../rag/chunking/custom_code/parser";
import { parseLanguageModelAugmentation } from "../rag/chunking/language_model_augmentation/parser"
import EmbeddingService from "../services/embeddingService";

export const useEmbeddingFiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { embeddingModel, chunkMode } = useSelector(
    (state: RootState) => state.rag
  );
  const { queue, meta } = useSelector((state: RootState) => state.projectIndex);
  const { currentPath } = useSelector((state: RootState) => state.hierarchy);

  const projectIndex = useProjectIndexFile();
  const ignoreAi = useIgnoreAi();
  const hashing = useHash();
  const readFile = useReadFile();
  const dispatch = useDispatch();

  const describeFile = async (file: any, content:string, language:string) => {
    const { name, path } = file;

    if (chunkMode === 'custom_code') {
      const parsed = parseCustomCode(name, path, content, language) as any;
      return parsed.qaSections;
    } else if (chunkMode === 'language_model_augmentation') {
      return parseLanguageModelAugmentation(path, content, language)
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
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const { name, path } = file;
        if (ignoreFile?.includes(name) || ignoreFile?.includes(path)) {
          console.log("skip file specified in ignore file");
          continue;
        }

        const fileInstance = await readFile.read(file);
        const content = fileInstance?.content || "";
        const language = fileInstance?.language || "plaintext";
        const hash = hashing.hash(`${path}:${content}:${project_id}`);

        const existingFile = await findEmbeddedFileByFilepathAndProjectId(
          path,
          project_id,
          embeddingModel
        );
        console.log(existingFile)
        if (existingFile?.file && existingFile?.file?.hash === hash) {
          console.log("skip unchanged existing file");
          continue;
        }

        const qaSections = await describeFile(file, content, language);
        if (!qaSections) continue;

        const embeddings = await EmbeddingService.create({ chunks: qaSections, model: embeddingModel });
        const data = {
          project_id,
          filepath: path,
          filename: name,
          hash,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        let file_id = existingFile?.file?.rowid;
        if (existingFile?.file) {
          console.log('updating file', data)
          await updateEmbeddedFile(existingFile?.file?.rowid, data, embeddingModel);
          await deleteAllQAByFileId(existingFile?.file?.rowid, embeddingModel);
        } else {
          console.log('inserting file', data)
          const result = await insertEmbeddedFile(data, embeddingModel);
          file_id = result.id;
        }

        for (const e of embeddings) {
          await insertQA({ 
            embedding: e.embedding, 
            project_id,
            file_id, 
            qa: e.chunk,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, embeddingModel);
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
