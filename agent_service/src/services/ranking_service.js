import { pipeline } from "@xenova/transformers";

export default class RankingService {
  static async rerank(query, documents) {
    if (process.NODE_ENV === 'test') {
      return documents.map((d, i) => {
        return { text: JSON.stringify(d), score: i/documents.length }
      })
    }
    
    const embed = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    documents = documents.map((d) => JSON.stringify(d));
    // Embed all sentences
    const queryEmbedding = await embed(query);
    const candidateEmbeddings = await Promise.all(documents.map(embed));

    // Function to compute cosine similarity
    function cosineSimilarity(vecA, vecB) {
      const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return dot / (magA * magB);
    }

    // Rank candidates
    const scores = candidateEmbeddings.map((vec) =>
      cosineSimilarity(queryEmbedding[0].data, vec[0].data)
    );
    const ranked = documents
      .map((text, i) => ({ text, score: scores[i] }))
      .sort((a, b) => b.score - a.score);

    return ranked;
  }
}
