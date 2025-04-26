import { WebsocketEvent } from "../event.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";
import UserAgentSessionOperationService from "../../services/user_agent_session_operation_service.js";
import AgentService from "../../services/agent_service.js";

export default class UserInputEvent extends WebsocketEvent {
  constructor() {
    super("client_function_result");
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

    const userAgentSessionMessionInput =
      await UserAgentSessionMessageService.create(
        {
          context: data,
          role: "system",
          userAgentSessionId: sessionId,
        },
        userId
      );

    reply("user_input_reply", userAgentSessionMessionInput);

    const lastMessages = await UserAgentSessionMessageService.findAll(
      sessionId,
      1,
      10,
      userId
    );

    /**
     * Create agent message
     */
    const agentResponse = await AgentService.prompt(data?.content, "system", [
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
        content: `Your current goal is ${operation?.name}. Use the function result to solve the problem.`,
      },
      {
        role: "developer",
        content: `You got ${operation.max_iterations-operation.iterations.length} left to complete your goal. You must not use function calls for the last available iteraiton.`,
      },
      {
        role: "developer",
        content: `This is a history of your actions: ${operation.iterations.map(m => m.user_agent_session_message.content).join(", ")}`,
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
    let newState =
      (operation.iterations.length + 1 >= operation.max_iterations ||
      !userAgentSessionMessionAgent.clientFn)
        ? "completed"
        : "running";
    const updatedOperation = await UserAgentSessionOperationService.update(
      operation._id.toString(),
      {
        state: newState,
        iterations: [
          ...operation.iterations.map(i=>{
            return { _id: i._id, user_agent_session_message: i.user_agent_session_message._id, created_at: i.created_at, updated_at: i.updated_at }
          }),
          { user_agent_session_message: userAgentSessionMessionAgent._id },
        ],
      },
      userId
    );
    reply("session_operation", updatedOperation);
  }
}
