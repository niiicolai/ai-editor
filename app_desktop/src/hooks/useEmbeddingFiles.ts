import { useDispatch, useSelector } from "react-redux";
import {
  useCreateEmbeddedFile,
  useTextSearchEmbeddedFiles,
  useUpdateEmbeddedFile,
  useVectorSearchEmbeddedFiles,
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

export const useEmbeddingFiles = () => {
  const { queue, meta } = useSelector((state: RootState) => state.projectIndex);
  const { currentPath, directoryState } = useSelector(
    (state: RootState) => state.hierarchy
  );
  const updateEmbeddedFile = useUpdateEmbeddedFile();
  const vectorSearchEmbeddedFiles = useVectorSearchEmbeddedFiles();
  const textSearchEmbeddedFiles = useTextSearchEmbeddedFiles();
  const projectIndex = useProjectIndexFile();
  const ignoreAi = useIgnoreAi();
  const hashing = useHash();
  const readFile = useReadFile();
  const parseFile = useParseFileContent();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      
      const filesForIndexing = await Promise.all(
        queue.map(async (f) => {
          const fileInstance = await readFile.read(f);
          const content = fileInstance?.content || "";
          const language = fileInstance?.language || "plaintext";
          const parsed = parseFile.parse(content, language);
          const description = `filename: ${f.name}\nfilepath: ${
            f.path
          }\nlanguage: ${language}\nlines: ${parsed?.lines}\ndescription: ${
            parsed?.description
          }\nvars: ${JSON.stringify(
            parsed?.vars || "[]"
          )}\nfunctions: ${JSON.stringify(
            parsed?.functions || "[]"
          )}\nclasses: ${JSON.stringify(parsed?.classes || "[]")}`;
          const hash = hashing.hash(description);
          return {
            embedding: [],
            project_id,
            filepath: f.path,
            filename: f.name,
            description,
            hash,
          };
        })
      );

      const filesToEmbedding = filesForIndexing.map((f) => {
        return { id: f.hash, content: f.description };
      });

      const embeddings = await EmbeddingService.create({ filesToEmbedding });

      for (const e of embeddings) {
        const f = filesForIndexing.find((file) => file.hash == e.id);
        if (!f) continue;
        for (const embedding of e.embeddings) {
          insertEmbeddedFile({
            project_id,
            filepath: f.filepath,
            filename: f.filename,
            description: f.description,
            hash: f.hash,
            embedding: embedding.embedding,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
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
