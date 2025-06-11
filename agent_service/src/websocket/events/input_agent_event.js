import { WebsocketEvent } from "../event.js";
import { creatChatCompletion } from "../../llm/index.js";
import { MessageBuilder } from "../../llm/messageBuilder.js";
import UserAgentSessionService from "../../services/user_agent_session_service.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";
import UserAgentSessionOperationService from "../../services/user_agent_session_operation_service.js";
import AvailableLlmService from "../../services/available_llm_service.js";
import LlmUsageService from "../../services/llm_usage_service.js";
import UserService from "../../services/user_service.js";
import Decimal from "decimal.js";
import ClientError from "../../errors/client_error.js";

export default class InputAgentEvent extends WebsocketEvent {
  constructor() {
    super("input_agent");
  }

  async execute(connection, reply, data) {
    try {
      const currentFile = data.currentFile ?? null;
      const focusFiles = data.focusFiles ?? null;
      const directoryInfo = data.directoryInfo ?? null;
      const embeddedFiles = data.embeddedFiles ?? null;
      const model = data.selected_llm ?? "gpt-4o-mini";
      const content = data.content;

      const userId = connection.userData?.user?._id;
      const sessionId = connection.userData?.sessionId;

      if (!userId) ClientError.badRequest("UserId not found");
      if (!sessionId) ClientError.badRequest("SessionId not found");
      if (!content) ClientError.badRequest("no content provided");

      const user = await UserService.find(userId);
      if (!user) ClientError.notFound("user not found");

      const user_credit = new Decimal(user.credit);
      if (user_credit.isZero() || user_credit.isNegative()) {
        ClientError.badRequest("insufficient credits");
      }

      const llm = await AvailableLlmService.findByName(model);
      if (!llm) ClientError.notFound("LLM model not found");

      const page = 1;
      const limit = 10;
      const lastMessages = await UserAgentSessionMessageService.findHistory(
        sessionId,
        page,
        limit,
        userId
      );

      const instruction = new MessageBuilder()
        .setAct(
          "Act as a helpful assistant helping a user with their coding project."
        )
        .addContext(
          currentFile
            ? `- User is inspecting: ${JSON.stringify(currentFile)}`
            : ""
        )
        .addContext(
          directoryInfo && Object.keys(directoryInfo).length > 0
            ? `- The file structure of the project is: ${JSON.stringify(
                directoryInfo
              )}`
            : ""
        )
        .addContext(
          focusFiles && focusFiles.length > 0
            ? `- Focus on the following files: ${JSON.stringify(focusFiles)}`
            : ""
        )
        .addContext(
          embeddedFiles && embeddedFiles.length > 0
            ? `-  Use the following files for context if it's relevant: ${JSON.stringify(
                embeddedFiles
              )}`
            : ""
        )
        .setContent(`This is the user's message: ${content.trim()}`)
        .build();

      const instructions = [...lastMessages.map((m) => m.message), instruction];

      const userAgentSessionMessionInput =
        await UserAgentSessionMessageService.create(
          {
            context: { content },
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

      if (lastMessages.length == 0) {
        await UserAgentSessionService.updateWithLlmTitle(
          sessionId,
          content,
          userId,
          instructions
        );
      }

      const { content: agentContent, usage } = await creatChatCompletion(
        instructions,
        {
          model,
          max_tokens: 10000,
          temperature: 0.7,
          useTools: true,
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

      await LlmUsageService.create(
        {
          llm: llm._id.toString(),
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
          messages: [
            userAgentSessionMessionInput._id,
            userAgentSessionMessionAgent._id,
          ],
          context_messages: lastMessages.map((m) => m._id),
          event: "agent",
        },
        userId
      );

      /**
       * Start operation if the response contains a client function
       * or update the active operation if any are running.
       */
      const operations = await UserAgentSessionOperationService.findAll(
        1,
        10,
        sessionId,
        userId,
        "running"
      );
      let operation = operations.total > 0 ? operations.operations[0] : null;
      if (operation) {
        operation = await UserAgentSessionOperationService.update(
          operation._id.toString(),
          {
            state:
              operation.iterations.length + 1 >= operation.max_iterations
                ? "completed"
                : "running",
            iterations: [
              ...operation.iterations,
              { user_agent_session_message: userAgentSessionMessionAgent._id },
            ],
          },
          userId
        );
        reply("session_operation", operation);
      } else if (agentContent.clientFn) {
        operation = await UserAgentSessionOperationService.create(
          {
            name: content,
            state: "running",
            max_iterations: 5,
            iterations: [
              { user_agent_session_message: userAgentSessionMessionAgent._id },
            ],
          },
          sessionId,
          userId
        );
        reply("session_operation", operation);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ClientError) {
        reply("error", { content: error.message, code: error.code });
      } else {
        reply("error", { content: "Internal server error" });
      }
    }
  }
}
