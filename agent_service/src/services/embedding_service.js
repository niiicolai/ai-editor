
import { createVectorEmbeddings } from "../embedding/index.js";
import ClientError from "../errors/clientError.js";
import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";

export default class EmbeddingService {
  static async create(body) {
    objectValidator(body, "body");
    if (!body?.filesToEmbedding) ClientError.badRequest("body.filesToEmbedding is required");
    const model = body?.model || "Xenova/all-MiniLM-L6-v2";
    const chunkSize = body?.chunkSize || 512;
    const results = [];
    for (const f of body.filesToEmbedding) {
      results.push({ 
        id: f.id, 
        embeddings: await createVectorEmbeddings(f?.content, { model, chunkSize })
      })
    }
    return results;
  }
}
