import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_EMBEDDING_API;
if (!API_URL)
  console.error(
    "CONFIGURATION ERROR(embeddingService.ts): VITE_EMBEDDING_API should be set in the .env file"
  );

export default class EmbeddingService {
  static async create(body: { model?: string; chunks: string[] }): Promise<
    {
      embedding: number[];
      chunk: string;
    }[]
  > {
    const response = await fetch(`${API_URL}/api/v1/embeddings`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${TokenService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const json = await response.json();

    return json;
  }
}
