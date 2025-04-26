import RootAgent from "../multi_agents/root_agent.js";
import NoFuncAgent from "../multi_agents/no_func_agent.js";

const rootAgent = new RootAgent();
const noFuncAgent = new NoFuncAgent();

export default class AgentService {
  static async prompt(content, role, messages = []) {
    console.log('prompt', messages)
    const response = await rootAgent.call({
      content,
      role,
      messages,
    });

    return {
      content: response.message,
      code: response.code,
      clientFn: response.clientFn,
    };
  }

  static async noFuncPrompt(content, role, messages = []) {
    const response = await noFuncAgent.call({
      content,
      role,
      messages,
    });

    return {
      content: response.message,
    };
  }
}
