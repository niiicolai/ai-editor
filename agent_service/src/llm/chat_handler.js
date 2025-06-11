import UserAgentSessionService from "../services/user_agent_session_service.js";
import UserAgentSessionMessageService from "../services/user_agent_session_message_service.js";
import LlmUsageService from "../services/llm_usage_service.js";
import AvailableLlmService from "../services/available_llm_service.js";
import ClientError from "../errors/client_error.js";
import { produceNewSampleSaga } from "../rabbitmq/sagas/new_sample_saga.js";
import { creatChatCompletion } from "./index.js";
import { MessageBuilder } from "./messageBuilder.js";

const RECORD_SAMPLES = parseInt(process.env.RECORD_SAMPLES || 0) === 1;

class MessageBuilderChatHandler extends MessageBuilder {
  constructor(handler) {
    super();
    this.handler = handler;
  }

  async build() {
    this.handler.instruction = super.build();
    this.handler.agentMessage = await UserAgentSessionMessageService.create(
      {
        context: { content: "None" },
        state: "pending",
        role: "assistant",
        userAgentSessionId: this.handler.sessionId,
      },
      this.handler.userId
    );
    this.handler.reply("user_input_reply", this.handler.agentMessage);
    return this.handler;
  }
}

export class ChatHandler {
  constructor(connection, reply, data) {
    this.currentFile = data.currentFile ?? null;
    this.focusFiles = data.focusFiles ?? null;
    this.directoryInfo = data.directoryInfo ?? null;
    this.embeddedFiles = data.embeddedFiles ?? null;
    this.embeddingModel = data.embeddingModel ?? "Unknown";
    this.chunkMode = data.chunkMode ?? "Unknown";
    this.searchMode = data.searchMode ?? "Unknown";
    this.model = data.selected_llm ?? "gpt-4o-mini";
    this.content = data.content;
    this.userId = connection.userData?.user?._id;
    this.userRole = connection.userData?.user?.role;
    this.sessionId = connection.userData?.sessionId;
    this.reply = reply;

    if (!this.userId) throw new Error("UserId not found");
    if (!this.sessionId) throw new Error("SessionId not found");
    if (!this.content) throw new Error("no content provided");
    if (!this.reply) throw new Error("no reply provided");

    this.userMessage = null;
    this.agentMessage = null;
    this.instruction = null;
    this.lastMessages = [];
  }

  /**
   * @function createAndSendUserMessage
   * @description create user message, send reply
   */
  async createAndSendUserMessage() {
    this.userMessage = await UserAgentSessionMessageService.create(
      {
        context: { content: this.content },
        role: "user",
        state: "completed",
        userAgentSessionId: this.sessionId,
      },
      this.userId
    );

    this.reply("user_input_reply", this.userMessage);

    return this;
  }

  /**
   * @function fetchLastMessages
   * @description fetch history for the chat
   */
  async fetchLastMessages(options = { page: 1, limit: 10 }) {
    this.lastMessages = await UserAgentSessionMessageService.findHistory(
      this.sessionId,
      options.page,
      options.limit,
      this.userId
    );

    return this;
  }

  /**
   * @function createChatTitle
   * @description create chat title for session with llm
   */
  async createChatTitle() {
    if (!this.lastMessages)
      throw new Error("Call fetchLastMessages() before creating a chat title");
    if (!this.instruction)
      throw new Error("Call createInstruction() before creating a chat title");
    const instructions = [
      ...this.lastMessages.map((m) => m.message),
      this.instruction,
    ];
    if (this.lastMessages.length == 0) {
      await UserAgentSessionService.updateWithLlmTitle(
        this.sessionId,
        this.content,
        this.userId,
        instructions
      );
    }
  }

  /**
   * @function newInstruction
   * @description build a new instruction, create temp reply, send temp reply
   */
  createInstruction() {
    this.messageBuilder = new MessageBuilderChatHandler(this);
    return this.messageBuilder;
  }

  /**
   * @function updateAndSendAgentMessage
   * @description update the temp message, generate reply, send reply and record usage
   */
  async updateAndSendAgentMessage(
    options = {
      event: "ask",
      max_tokens: 10000,
      temperature: 0.7,
      useTools: false,
    }
  ) {
    if (!this.instruction || !this.agentMessage)
      throw new Error(
        "Call createInstruction() before creating and sending the agent message"
      );
    const llm = await AvailableLlmService.findByName(this.model);
    if (!llm) ClientError.notFound("LLM model not found");

    const instructions = [
      ...this.lastMessages.map((m) => m.message),
      this.instruction,
    ];

    const { content: agentContent, usage } = await creatChatCompletion(
      instructions,
      {
        model: this.model,
        max_tokens: options.max_tokens,
        temperature: options.temperature,
        useTools: options.useTools,
      }
    );

    const updatedMessage = await UserAgentSessionMessageService.update(
      this.agentMessage._id.toString(),
      {
        content: agentContent.message,
        state: "completed",
        code: agentContent.code,
        clientFn: agentContent.clientFn,
      },
      this.userId
    );

    this.reply("user_input_reply_update", updatedMessage);
    this.agentMessage = updatedMessage;
    this.event = options.event;

    await LlmUsageService.create(
      {
        llm: llm._id.toString(),
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        messages: [
          updatedMessage._id,
          ...(this.userMessage && [this.userMessage._id]),
        ],
        context_messages: this.lastMessages.map((m) => m._id),
        event: options.event,
      },
      this.userId
    );
  }

  /**
   * @function recordSample
   * @description record the sample for RAG evaluation (only for admins)
   */
  async recordSample() {
    if (!RECORD_SAMPLES || this.userRole !== 'admin') return;

    await produceNewSampleSaga({
      input_prompt: this.content,
      input_embedded_files: this.embeddedFiles || [],
      output_response: this.agentMessage.content,
      llm_config: this.model,
      embedding_config: this.embeddingModel,
      chunk_config: this.chunkMode,
      search_config: this.searchMode,
      event_config: this.event,
    });
  }
}
