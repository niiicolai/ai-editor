
export interface EmbeddedFileType {
  rowid: number;
  embedding: number[];
  project_id: string;
  filepath: string;
  filename: string;
  description: string;
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