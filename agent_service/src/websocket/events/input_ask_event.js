import { WebsocketEvent } from "../event.js";
import UserService from "../../services/user_service.js";
import Decimal from "decimal.js";

import { ChatHandler } from "../../llm/chat_handler.js";

export default class InputAskEvent extends WebsocketEvent {
  constructor() {
    super("input_ask");
  }

  async execute(connection, reply, data) {
    try {
      const currentFile = data.currentFile ?? null;
      const focusFiles = data.focusFiles ?? null;
      const directoryInfo = data.directoryInfo ?? null;
      const embeddedFiles = data.embeddedFiles ?? null;
      const content = data.content;

      const userId = connection.userData?.user?._id;
      const sessionId = connection.userData?.sessionId;

      if (!userId) throw new Error("UserId not found");
      if (!sessionId) throw new Error("SessionId not found");
      if (!content) throw new Error("no content provided");

      const user = await UserService.find(userId);
      if (!user) throw new Error("user not found");

      const user_credit = new Decimal(user.credit);
      if (user_credit.isZero() || user_credit.isNegative()) {
        throw new Error("insufficient credits");
      }

      const handler = new ChatHandler(connection, reply, data);
      
      await handler.fetchLastMessages({ page: 1, limit: 10 });

      await handler.createAndSendUserMessage();

      await (handler.createInstruction()
            .setAct("Act as a helpful assistant.")
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
                ? `- Focus on the following files: ${JSON.stringify(
                    focusFiles
                  )}`
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
            .build()
      );

      await handler.createChatTitle();

      await handler.updateAndSendAgentMessage({
        event: 'ask',
        max_tokens: 10000,
        temperature: 0.7,
        useTools: false,
      });
    } catch (error) {
      console.log(error);
      reply("error", { content: "Something went wrong" });
    }
  }
}
