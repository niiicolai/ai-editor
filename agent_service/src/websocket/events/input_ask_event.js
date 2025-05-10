import { WebsocketEvent } from "../event.js";
import UserAgentSessionService from "../../services/user_agent_session_service.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";
import UserAgentSessionOperationService from "../../services/user_agent_session_operation_service.js";
import AgentService from "../../services/agent_service.js";
import ProjectIndexItemService from "../../services/project_index_item_service.js";

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
            content: `The directory state is ${JSON.stringify(directoryInfo)}`,
          },
          {
            role: "developer",
            content: `The user want you to focus on ${JSON.stringify(
              focusFiles
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
     * Semantic search
     */
    let codebaseDocs = [];
    if (data.projectIndexId) {
      codebaseDocs = (
        await ProjectIndexItemService.search(
          `${focusFiles && focusFiles.length > 0
            ? `${JSON.stringify(focusFiles)}`
            : ""} ${content}`,
          data.projectIndexId,
          userId,
          2
        )
      ).map((item) => item.description);
    }

    /**
     * Create agent message
     */
    const agentResponse = await AgentService.noFuncPrompt(content,
      "user",
      [
        ...lastMessages.messages.map((m) => {
          return { role: m.role, content: m.content };
        }),
        {
          role: 'developer', content: `${
            codebaseDocs && codebaseDocs.length > 0
              ? `You may use the following information for your answer if it's relevant: ${JSON.stringify(
                  codebaseDocs
                )}`
              : ""
          }
                  
          ${
            currentFile
              ? `The user is currently looking at file: ${currentFile?.name}`
              : ""
          }
    
          ${
            directoryInfo
              ? `The structure of the project is: ${JSON.stringify(directoryInfo)}`
              : ""
          }
    
          ${
            focusFiles && focusFiles.length > 0
              ? `Focus on the following files: ${JSON.stringify(focusFiles)}`
              : ""
          }
    
          Example answer:
            Thanks for the answer. It is ...`
        }
      ]
    );
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

    reply("user_input_reply_update", updatedUserAgentSessionMessionAgent);
  }
}
