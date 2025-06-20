import { WebsocketEvent } from "../event.js";
import { ChatHandler } from "../../llm/chat_handler.js";
import UserService from "../../services/user_service.js";
import RankingService from "../../services/ranking_service.js";
import Decimal from "decimal.js";
import ClientError from "../../errors/client_error.js";

export default class RagTestEvent extends WebsocketEvent {
  constructor() {
    super("rag_test");
  }

  async execute(connection, reply, data) {
    try {
      const content = data.content;
      const embeddedFiles = data.embeddedFiles;
      const userId = connection.userData?.user?._id;
      const sessionId = connection.userData?.sessionId;

      if (!embeddedFiles || !embeddedFiles.length)
        ClientError.badRequest("embeddedFiles is required");
      if (!userId) ClientError.badRequest("UserId not found");
      if (!sessionId) ClientError.badRequest("SessionId not found");
      if (!content) ClientError.badRequest("no content provided");

      const user = await UserService.find(userId);
      if (!user) ClientError.notFound("user not found");

      const user_credit = new Decimal(user.credit);
      if (user_credit.isZero() || user_credit.isNegative()) {
        ClientError.badRequest("insufficient credits");
      }

      const documents = (
        await RankingService.rerank(content, embeddedFiles)
      ).map((r) => r.text);
      const handler = new ChatHandler(connection, reply, data);

      console.log(
        `Use the following files for context if it's relevant: ${JSON.stringify(
          documents
        )}`
      );
      console.log(`This is the user's message: ${content.trim()}`);

      //await handler.fetchLastMessages({ page: 1, limit: 10 }); Only consider user question.
      await handler.createAndSendUserMessage();
      await handler
        .createInstruction()
        .setAct("Act as a helpful assistant.")
        .addContext(
          `Use the following files for context if it's relevant: ${JSON.stringify(
            documents
          )}`
        )
        .setContent(`This is the user's message: ${content.trim()}`)
        .build();
      await handler.updateAndSendAgentMessage({
        event: "rag_test",
        max_tokens: 10000,
        temperature: 0.7,
        useTools: false,
      });
      await handler.recordSample();
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
