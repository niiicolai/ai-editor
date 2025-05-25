import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_AGENT_API;
if (!API_URL)
  console.error(
    "CONFIGURATION ERROR(llmService.ts): VITE_AGENT_API should be set in the .env file"
  );

export default class LlmService {
  static async create(body: {
    event: string;
    messages: { role: string; content: string }[];
    response_format?: any
  }): Promise<{
    content: any;
  }> {
    const response = await fetch(`${API_URL}/api/v1/create_llm_message`, {
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

    return json?.data;
  }
}
