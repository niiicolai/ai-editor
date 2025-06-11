import { useSelector } from "react-redux";
import { useVectorSearchQA } from "./useQAFile";
import { RootState } from "../store";
import EmbeddingService from "../services/embeddingService";
import { useState } from "react";

export const useRagSearch = () => {
  const { embeddingModel: model } = useSelector(
    (state: RootState) => state.rag
  );
  const { meta } = useSelector((state: RootState) => state.projectIndex);
  const vectorSearch = useVectorSearchQA();
  const [isLoading, setIsLoading] = useState(false);

  const search = async (chunks: string[]) => {
    if (!meta?._id) return;
    setIsLoading(true);
    try {
      const embeddedFiles = [];
      const embeddingResult = await EmbeddingService.create({ chunks, model });
      const queryEmbedding = embeddingResult[0].embedding;
      const searchResponse = await vectorSearch.search(
        meta._id,
        queryEmbedding
      );
      const sortedResult = searchResponse?.result?.sort(
        (a: any, b: any) => b.distance - a.distance
      );
      if (sortedResult) embeddedFiles.push(...sortedResult);

      const uniqueEmbeddedFiles = embeddedFiles
        .filter(
          (file, index, self) =>
            file.rowid &&
            self.findIndex((f) => f.rowid === file.rowid) === index
        )
        .map((ef) => ef.qa);

      return uniqueEmbeddedFiles;
    } catch (err: any) {
      console.log(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { search, isLoading };
};
