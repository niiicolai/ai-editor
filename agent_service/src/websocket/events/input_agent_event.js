import { WebsocketEvent } from "../event.js";
import UserAgentSessionService from "../../services/user_agent_session_service.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";
import UserAgentSessionOperationService from "../../services/user_agent_session_operation_service.js";
import AgentService from "../../services/agent_service.js";

export default class InputAgentEvent extends WebsocketEvent {
  constructor() {
    super("input_agent");
  }

  async execute(connection, reply, data) {
    if (!connection.userData?.user?._id) {
      reply("error", { content: "User not found" });
      return;
    }
    if (!connection.userData?.sessionId) {
      reply("error", { content: "SessionId not found" });
      return;
    }


    const sessionId = connection.userData.sessionId;
    const userId = connection.userData.user._id;

    const lastMessages = await UserAgentSessionMessageService.findAll(
      sessionId,
      1,
      10,
      userId
    );

    const userAgentSessionMessionInput =
      await UserAgentSessionMessageService.create(
        {
          context: data,
          state: "completed",
          role: "user",
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

    /**
     * Update session title if it is the first message.
     */
    if (lastMessages.messages.length == 0) {
      const titleResponse = await AgentService.noFuncPrompt(
        `Based on the following input, select a chat title: ${data?.content}; Be creative. Do not put quotes around the title.`,
        "user",
        [
          ...lastMessages.messages.map((m) => {
            return { role: m.role, content: m.content };
          }),
          {
            role: "developer",
            content: `The current file is ${data?.currentFile?.name}`,
          },
          {
            role: "developer",
            content: `The directory state is ${JSON.stringify(
              data?.directoryInfo
            )}`,
          },
          {
            role: "developer",
            content: `The user want you to focus on ${JSON.stringify(
              data?.focusFiles
            )}`,
          },
        ]
      );
      console.log(titleResponse);
      await UserAgentSessionService.update(
        sessionId,
        { title: titleResponse.content },
        userId,
        null
      );
    }

    /**
     * Create agent message
     */
    const agentResponse = await AgentService.prompt(data?.content, "user", [
      ...lastMessages.messages.map((m) => {
        return { role: m.role, content: m.content };
      }),
      {
        role: "developer",
        content: `The current file is ${data?.currentFile?.name}`,
      },
      {
        role: "developer",
        content: `The directory state is ${JSON.stringify(
          data?.directoryInfo
        )}`,
      },
      {
        role: "developer",
        content: `The user want you to focus on ${JSON.stringify(
          data?.focusFiles
        )}`,
      },
    ]);
    const updatedUserAgentSessionMessionAgent =
      await UserAgentSessionMessageService.update(
        userAgentSessionMessionAgent._id.toString(),
        {
          content: agentResponse.content,
          state: "completed",
          code: agentResponse.code,
          clientFn: agentResponse.clientFn,
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
    } else if (agentResponse.clientFn) {
      const goalResponse = await AgentService.noFuncPrompt(
        `Make a very short description of my goal: ${data?.content}; Do not put quotes around the description.`,
        "user",
        [
          ...lastMessages.messages.map((m) => {
            return { role: m.role, content: m.content };
          }),
          {
            role: "developer",
            content: `The current file is ${data?.currentFile?.name}`,
          },
          {
            role: "developer",
            content: `The directory state is ${JSON.stringify(
              data?.directoryInfo
            )}`,
          },
        ]
      );
      operation = await UserAgentSessionOperationService.create(
        {
          name: goalResponse.content,
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

    reply("user_input_reply_update", updatedUserAgentSessionMessionAgent);
  }
}
