import { pipeline } from "@xenova/transformers";

export default class EmbeddingService {
  static async createChunksAndVectorEmbeddings(content = "", chunkSize = 512) {
    const chunks = [];

    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize).trim();
      chunks.push(chunk);
    }

    return await this.createVectorEmbeddings(chunks);
  }

  static async createVectorEmbeddings(chunks = []) {
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const result = [];
    for (let i = 0; i < chunks.length; i++) {
      const embeddings = await extractor(chunks, {
        pooling: "mean",
        normalize: true,
      });

      result.push({ chunk: chunks[i], embedding: Array.from(embeddings[0].data) });
    }

    return result;
  }
}
