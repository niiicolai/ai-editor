import { WebsocketEvent } from "../event.js";
import UserAgentSessionService from "../../services/user_agent_session_service.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";
import AvailableLlmService from "../../services/available_llm_service.js";
import LlmUsageService from '../../services/llm_usage_service.js';
import UserService from '../../services/user_service.js';
import RagService from "../../services/rag_service.js";
import Decimal from 'decimal.js'

export default class InputAskEvent extends WebsocketEvent {
  constructor() {
    super("input_ask");
  }

  async execute(connection, reply, data) {
    const currentFile = data.currentFile ?? null;
    const focusFiles = data.focusFiles ?? null;
    const directoryInfo = data.directoryInfo ?? null;
    const projectIndexId = data.projectIndexId ?? null;
    const model = data.selected_llm ?? "gpt-4o-mini";

    const userId = connection.userData?.user?._id;
    if (!userId) {
      reply("error", { content: "User not found" });
      return;
    }

    const sessionId = connection.userData?.sessionId;
    if (!sessionId) {
      reply("error", { content: "SessionId not found" });
      return;
    }

    const content = data.content;
    if (!content) {
      reply("error", { content: "no content provided" });
      return;
    }

    const llm = await AvailableLlmService.findByName(model);
    if (!llm) {
      reply("error", { content: "LLM model not found" });
      return;
    }

    const user = await UserService.find(userId);
    if (!user) {
      reply("error", { content: "user not found" });
      return;
    }
    const user_credit = new Decimal(user.credit);
    if (user_credit.isZero() || user_credit.isNegative()) {
      reply("error", { content: "insufficient credits" });
      return;
    }

    const page = 1;
    const limit = 10;
    const lastMessages = await UserAgentSessionMessageService.findAll(
      sessionId,
      page,
      limit,
      userId
    );
    const instructions = [
      ...lastMessages.messages.map((m) => {
        return { role: m.role, content: m.content };
      }),
      ...(currentFile ? [{
        role: "developer",
        content: `The user is currently looking at file: ${currentFile?.name}`,
      }] : []),
      ...(directoryInfo ? [{
        role: "developer",
        content: `The structure of the project is: ${JSON.stringify(
          directoryInfo
        )}`,
      }] : []),
      ...(focusFiles &&
        focusFiles.length > 0 ? [{
          role: "developer",
          content: `Focus on the following files: ${JSON.stringify(
            focusFiles
          )}`,
        }] : []),
      {
        role: "developer",
        content: `Example answer: Thanks for the answer. It is ...`,
      },
    ];

    const userAgentSessionMessionInput =
      await UserAgentSessionMessageService.create(
        {
          context: { content, currentFile, focusFiles, directoryInfo },
          role: "user",
          state: "completed",
          userAgentSessionId: sessionId,
        },
        userId
      );

    reply("user_input_reply", userAgentSessionMessionInput);

    const userAgentSessionMessionAgent =
      await UserAgentSessionMessageService.create(
        {
          context: { content: "None" },
          state: "pending",
          role: "assistant",
          userAgentSessionId: sessionId,
        },
        userId
      );
    reply("user_input_reply", userAgentSessionMessionAgent);

    if (lastMessages.messages.length == 0) {
      await UserAgentSessionService.updateWithLlmTitle(
        sessionId,
        content,
        userId,
        instructions
      );
    }

    const { content: agentContent, usage } = await RagService.retrieveAndGenerate(
      content,
      userId,
      {
        projectIndexId,
        projectIndexLimit: 2,
        model,
        max_tokens: 10000,
        temperature: 0.7,
        useTools: false,
        messages: instructions,
      }
    );

    const updatedUserAgentSessionMessionAgent =
      await UserAgentSessionMessageService.update(
        userAgentSessionMessionAgent._id.toString(),
        {
          content: agentContent.message,
          state: "completed",
          code: agentContent.code,
          clientFn: agentContent.clientFn,
        },
        userId
      );

    reply("user_input_reply_update", updatedUserAgentSessionMessionAgent);

    await LlmUsageService.create({
      llm: llm._id.toString(),
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
      messages: [
        userAgentSessionMessionInput._id,
        userAgentSessionMessionAgent._id
      ],
      context_messages: lastMessages.messages.map((m)=>m._id),
      event: "ask"
    }, userId);
  }
}
