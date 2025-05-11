import { pipeline } from "@xenova/transformers";
import { Model } from "../model.js";

export default class AllMiniLmL6V2 extends Model {
  constructor() {
    super("Xenova/all-MiniLM-L6-v2");
  }

  async createVectorEmbeddings(chunks = []) {
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

      result.push({
        chunk: chunks[i],
        embedding: Array.from(embeddings[0].data),
      });
    }

    return result;
  }
}
