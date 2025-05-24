
export interface QAType {
  rowid: number;
  embedding: number[];
  code_t5_file_id?: number;
  all_minilm_l6_v2_file_id?: number;
  qa: string;
  created_at: string;
  updated_at: string;
}

export interface QAsType {
  id: string;
  embeddings: {
    embedding: number[];
    chunk: string;
  }[]
}