import ProjectIndexItemService from "./project_index_item_service.js";
import { creatChatCompletion } from '../llm/index.js';

export default class RagService {
  static async retrieveAndGenerate(query = "", userId, options = {
    messages: [],
    projectIndexId: null,
    projectIndexLimit: 2,

    model: "gpt-4o-mini",
    max_tokens: 10000,
    temperature: 0.3,
    useTools: false,
  }) {

    let codebaseDocs = [];
    if (options.projectIndexId) {
      codebaseDocs = (
        await ProjectIndexItemService.search(
          query,
          options.projectIndexId,
          userId,
          options.projectIndexLimit,
        )
      ).map((item) => item.description);
    }

    const response = await creatChatCompletion([
      ...options.messages,
      {
        role: 'user', 
        content: codebaseDocs && codebaseDocs.length > 0
              ? `You may use the following information for your answer if it's relevant: ${JSON.stringify(codebaseDocs)}`
              : ""
      },
      {
        role: 'user', 
        content: query
      }
    ], {
      model: options.model,
      max_tokens: options.max_tokens,
      temperature: options.temperature,
      useTools: options.useTools,
    });

    return response;
  }
}
