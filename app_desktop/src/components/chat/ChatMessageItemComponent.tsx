import SyntaxHighlighter from "react-syntax-highlighter";
import Markdown from "react-markdown";
import { ChevronRight, FileWarning, Loader, User } from "lucide-react";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { UserAgentSessionMessageType } from "../../types/userAgentSessionMessageType";
import { useState } from "react";
import editorAvatarImage from "../../assets/editorNoMessages.png";

function ChatMessageItemComponent({
  message,
}: {
  message: UserAgentSessionMessageType;
}) {
  const [expandedBlocks, setExpandedBlocks] = useState<{
    [key: string]: boolean;
  }>({});
  const toggleBlock = (messageId: string, blockType: string) => {
    const key = `${messageId}-${blockType}`;
    setExpandedBlocks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
    <div className={`flex ${message.role == "system" ? "" : ""}`}>
      {message.state == "pending" && (
        <div className="chat-msg-assistant rounded-lg px-4 py-2 w-full shadow-sm main-color border-1 border-color">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full chat-msg-assistant-bubble border-1 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                <img src={editorAvatarImage} className="w-6" />
              </span>
            </div>
            <div className="flex-1 flex items-center justify-between gap-1">
              <span className="text-xs">Thinking...</span>
              <Loader className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          </div>
        </div>
      )}
      <div
        className={`flex flex-col gap-2 w-full whitespace-pre-wrap break-words max-w-full overflow-x-hidden ${
          message.state == "completed" ? "" : "hidden"
        }`}
      >
        <div
          className={`rounded-lg px-4 py-2 w-full shadow-sm main-color border-1 border-color ${
            message.role === "user" ? "chat-msg-user" : "chat-msg-assistant"
          }`}
        >
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              {message.role === "user" && (
                <div className="h-8 w-8 rounded-full chat-msg-user-bubble border-1 flex items-center justify-center">
                  <span className="text-white font-medium">
                    <User className="w-4 h-4 chat-msg-user-bubble" />
                  </span>
                </div>
              )}
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full chat-msg-assistant-bubble border-1 flex items-center justify-center">
                  <span className="font-medium">
                    <img src={editorAvatarImage} className="w-6" />
                  </span>
                </div>
              )}
              {message.role === "error" && (
                <div className="h-8 w-8 rounded-full chat-msg-assistant-bubble border-1 flex items-center justify-center">
                  <span className="font-medium">
                    <FileWarning className="w-4 h-4" />
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-xs whitespace-pre-wrap break-words w-full overflow-hidden [&_p]:mb-0.1 [&_p]:w-64 [&_ol]:mb-0.1 [&_ol]:w-64 [&_ul]:mb-0.1 [&_ul]:w-64 [&_li]:mb-0.1 [&_li]:p-0.1 [&_li]:w-64 [&_pre]:w-64 [&_pre]:rounded-md [&_pre]:mb-0.1 [&_pre]:p-1 [&_pre]:border [&_pre]:overflow-x-auto [&_code]:w-64 [&_code]:overflow-x-auto">
                {message.role === "error" && (
                  <div className="font-bold">
                    Error:
                  </div>
                )}
                <Markdown>{message.content}</Markdown>
              </div>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user"
                    ? "chat-msg-user-small"
                    : "chat-msg-assistant-small"
                }`}
              >
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {message.code && (
          <div className="w-full">
            <button
              onClick={() => toggleBlock(message._id, "code")}
              className="w-full text-left px-4 py-2 button-main rounded-lg flex items-center justify-between"
            >
              <span className="text-sm font-medium text-gray-100">Code</span>
              <span className="text-gray-500">
                {expandedBlocks[`${message._id}-code`] ? "▼" : "▶"}
              </span>
            </button>
            {expandedBlocks[`${message._id}-code`] && (
              <div className="mt-2 rounded-lg shadow-sm">
                <SyntaxHighlighter style={dracula}>
                  {message.code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}

        {message.clientFn && (
          <div className="w-full">
            <div className="rounded-lg  highlight-bgg border-color border-1 p-1 shadow-sm flex gap-1 overflow-hidden">
              <div>
                <ChevronRight className="w-4 h-4 main-color mt-0.5" />
              </div>
              <div>
                <div className="flex gap-1 main-color">
                  <p className="font-bold text-white">Function:</p>
                  <p className="text-white">{message.clientFn.name}</p>
                </div>
                <div className="flex gap-1 main-color">
                  <p className="font-bold text-white">Args:</p>
                  <p className="text-white">{message.clientFn.args}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessageItemComponent;
