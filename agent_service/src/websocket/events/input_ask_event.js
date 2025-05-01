import { WebsocketEvent } from "../event.js";
import UserAgentSessionService from "../../services/user_agent_session_service.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";
import UserAgentSessionOperationService from "../../services/user_agent_session_operation_service.js";
import AgentService from "../../services/agent_service.js";

export default class InputAskEvent extends WebsocketEvent {
  constructor() {
    super("input_ask");
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

    const content = data.content;
    const currentFile = data.currentFile;
    const focusFiles = data.focusFiles;
    const directoryInfo = data.directoryInfo;

    console.log(data)

    const lastMessages = await UserAgentSessionMessageService.findAll(
      sessionId,
      1,
      10,
      userId
    );

    const userAgentSessionMessionInput =
      await UserAgentSessionMessageService.create(
        {
          context: { content, currentFile, focusFiles, directoryInfo },
          role: "user",
          userAgentSessionId: sessionId,
        },
        userId
      );

    reply("user_input_reply", userAgentSessionMessionInput);

    /**
     * Update session title if it is the first message.
     */
    if (lastMessages.messages.length == 0) {
      const titleResponse = await AgentService.noFuncPrompt(
        `Based on the following input, select a chat title: ${content}; Be creative. Do not put quotes around the title.`,
        "user",
        [
          ...lastMessages.messages.map((m) => {
            return { role: m.role, content: m.content };
          }),
          {
            role: "developer",
            content: `The current file is ${currentFile?.name}`,
          },
          {
            role: "developer",
            content: `The directory state is ${JSON.stringify(
              directoryInfo
            )}`,
          },
          {
            role: "developer",
            content: `The user want you to focus on ${JSON.stringify(
              focusFiles
            )}`,
          },
        ]
      );
      console.log(titleResponse)
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
    const agentResponse = await AgentService.noFuncPrompt(content, "user", [
      ...lastMessages.messages.map((m) => {
        return { role: m.role, content: m.content };
      }),
      {
        role: "developer",
        content: `The current file is ${currentFile?.name}`,
      },
      {
        role: "developer",
        content: `The directory state is ${JSON.stringify(
          directoryInfo
        )}`,
      },
      {
        role: "developer",
        content: `The user want you to focus on ${JSON.stringify(
          focusFiles
        )}`,
      },
    ]);
    const userAgentSessionMessionAgent =
      await UserAgentSessionMessageService.create(
        {
          context: {
            content: agentResponse.content,
            clientFn: agentResponse.clientFn,
            code: agentResponse.code,
          },
          role: "assistant",
          userAgentSessionId: sessionId,
        },
        userId
      );

    reply("user_input_reply", userAgentSessionMessionAgent);
  }
}
