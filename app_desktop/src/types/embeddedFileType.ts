import { QAType } from "./qaType";

export interface EmbeddedFileType {
  rowid: number;
  project_id: string;
  filepath: string;
  filename: string;
  question_answers?: QAType[];
  hash: string;
  created_at: string;
  updated_at: string;
}

export interface EmbeddingsType {
  id: string;
  embeddings: {
    embedding: number[];
    chunk: string;
  }[]
}