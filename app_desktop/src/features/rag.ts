import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { questions } from "../rag/evaluation/questions";

interface RAG {
  embeddingModel: string;
  chunkMode: string;
  searchMode: string;
  autoEvaluation: {
    questions: string[];
  };
}

const ragSlice = createSlice({
  name: "rag",
  initialState: {
    embeddingModel: "Salesforce/codet5p-110m-embedding",
    chunkMode: "custom_code",
    searchMode: "vector_search",
    autoEvaluation: {
      questions: Object.values(questions).map((q:any) => q.question),
    },
  } as RAG,
  reducers: {
    setEmbeddingModel: (state: RAG, action: PayloadAction<string>) => {
      if (
        !["all-MiniLM-L6-v2", "Salesforce/codet5p-110m-embedding"].includes(
          action.payload
        )
      )
        throw new Error("Unsupported embedding model");

      state.embeddingModel = action.payload;
    },
    setChunkMode: (state: RAG, action: PayloadAction<string>) => {
      if (
        !["custom_code", "language_model_augmentation"].includes(action.payload)
      )
        throw new Error("Unsupported chunk mode");
      state.chunkMode = action.payload;
    },
    setSearchMode: (state: RAG, action: PayloadAction<string>) => {
      if (!["vector_search"].includes(action.payload))
        throw new Error("Unsupported search mode");
      state.searchMode = action.payload;
    },
    setAutoEvaluation: (
      state: RAG,
      action: PayloadAction<{
        questions: string[];
      }>
    ) => {
      state.autoEvaluation = action.payload;
    },
  },
});

const persistConfig = {
  key: "rag",
  storage,
};

export const {
  setEmbeddingModel,
  setChunkMode,
  setSearchMode,
  setAutoEvaluation,
} = ragSlice.actions;
export default persistReducer(persistConfig, ragSlice.reducer);
