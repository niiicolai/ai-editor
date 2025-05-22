import { pipeline } from "@xenova/transformers";

export default class RankingService {
  static async rerank(query, documents) {
    const embed = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    // Embed all sentences
    const queryEmbedding = await embed(query);
    const candidateEmbeddings = await Promise.all(candidates.map(embed));

    // Function to compute cosine similarity
    function cosineSimilarity(vecA, vecB) {
      const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return dot / (magA * magB);
    }

    // Rank candidates
    const scores = candidateEmbeddings.map((vec) =>
      cosineSimilarity(queryEmbedding[0], vec[0])
    );
    const ranked = candidates
      .map((text, i) => ({ text, score: scores[i] }))
      .sort((a, b) => b.score - a.score);

      return ranked;
  }
}
