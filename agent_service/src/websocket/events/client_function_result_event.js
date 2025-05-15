import { WebsocketEvent } from "../event.js";
import { creatChatCompletion } from "../../llm/index.js";
import { MessageBuilder } from "../../llm/messageBuilder.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";
import UserAgentSessionOperationService from "../../services/user_agent_session_operation_service.js";
import AvailableLlmService from "../../services/available_llm_service.js";
import LlmUsageService from "../../services/llm_usage_service.js";
import UserService from "../../services/user_service.js";
import Decimal from "decimal.js";

export default class UserInputEvent extends WebsocketEvent {
  constructor() {
    super("client_function_result");
  }

  async execute(connection, reply, data) {
    try {
      const currentFile = data.currentFile ?? null;
      const focusFiles = data.focusFiles ?? null;
      const directoryInfo = data.directoryInfo ?? null;
      const embeddedFiles = data.embeddedFiles ?? null;
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

      const messageId = data._id;
      if (!messageId) {
        reply("error", { content: "MessageId not found" });
        return;
      }

      const message = await UserAgentSessionMessageService.find(
        messageId,
        userId
      );
      if (!message) {
        reply("error", { content: "Message not found" });
        return;
      }

      await UserAgentSessionMessageService.update(
        messageId,
        {
          clientFn: {
            name: message.clientFn.name,
            args: message.clientFn.args,
            result: content,
          },
        },
        userId
      );

      const operations = await UserAgentSessionOperationService.findAll(
        1,
        10,
        sessionId,
        userId,
        "running"
      );
      const operation = operations.total > 0 ? operations.operations[0] : null;
      if (!operation) {
        return;
      }

      const page = 1;
      const limit = 10;
      const lastMessages = await UserAgentSessionMessageService.findHistory(
        sessionId,
        page,
        limit,
        userId
      );

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

      const instruction = new MessageBuilder()
        .setAct(
          `Your current goal is ${operation?.name}. Use the function result to solve the problem.`
        )
        .addContext(
          `You got ${
            operation.max_iterations - operation.iterations.length
          } left to complete your goal. You must not use function calls for the last available iteration.`
        )
        .addContext(
          `This is a history of your actions: ${operation.iterations
            .map(
              (m) => `
            ${m.user_agent_session_message.content}
            ${m.user_agent_session_message.clientFn?.name}(${m.user_agent_session_message.clientFn?.args}) => ${m.user_agent_session_message.clientFn?.result}`
            )
            .join(", ")}`
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
      let newState =
        operation.iterations.length + 1 >= operation.max_iterations ||
        !userAgentSessionMessionAgent.clientFn
          ? "completed"
          : "running";
      const updatedOperation = await UserAgentSessionOperationService.update(
        operation._id.toString(),
        {
          state: newState,
          iterations: [
            ...operation.iterations.map((i) => {
              return {
                _id: i._id,
                user_agent_session_message: i.user_agent_session_message._id,
                created_at: i.created_at,
                updated_at: i.updated_at,
              };
            }),
            { user_agent_session_message: userAgentSessionMessionAgent._id },
          ],
        },
        userId
      );
      reply("session_operation", updatedOperation);

      await LlmUsageService.create(
        {
          llm: llm._id.toString(),
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
          messages: [
            userAgentSessionMessionAgent._id,
          ],
          context_messages: lastMessages.map((m) => m._id),
          event: "function_result",
        },
        userId
      );
    } catch (error) {
      console.log(error);
      reply("error", { content: "Something went wrong" });
    }
  }
}
