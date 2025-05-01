import Scrollbar from "react-scrollbars-custom";
import ChatMessageItemComponent from "./ChatMessageItemComponent";
import editorNoMessages from "../../assets/editorNoMessages.png";
import { useGetUserAgentSessionMessages as useGetMessages } from "../../hooks/useUserAgentSessionMessage";
import { useRef, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { usePagination } from "../../hooks/usePagination";

function ChatMessagesComponent() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { page, nextPage, prevPage, limit } = usePagination(10);
  const { sessionId, messages: sessionMessages, operation } = useSelector((state: RootState) => state.userAgentSession);
  const { data, isLoading, error } = useGetMessages(page, limit, (sessionId || ""));
  const messages = [...sessionMessages, ...(data?.messages || [])];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-color"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg">Error loading messages</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col border-r border-color"
      style={{ height: "100px" }}
    >
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 main-bgg text-xs">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="cursor-pointer inline-flex items-center px-3 py-1 font-medium rounded-md button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="highlight-color">
            Page {page} of {data.pages}
          </span>
          <button
            onClick={() => nextPage(data.pages)}
            disabled={page >= data.pages}
            className="cursor-pointer inline-flex items-center px-3 py-1 font-medium rounded-md button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {operation && operation.state == "running" && (
        <div className="p-3 border-color border-b flex gap-3">
          <div>
            <LoaderIcon className="w-4 h-4 mt-0.5 text-indigo-500 animate-spin" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-1">
              <p className="text-white text-sm">Working...</p>
              <p className="text-white text-xs">
                {operation.iterations.length} out of {operation.max_iterations}
              </p>
            </div>
            <p className="text-white text-xs">Goal: {operation.name}</p>
          </div>
        </div>
      )}

      {messages && messages?.length > 0 && (
        <Scrollbar
          style={{ height: 250 }}
          className="flex-1 w-full border-b border-color h-full text-sm text-white"
        >
          <div className="p-2 space-y-2">
            {messages?.map((message) => (
              <ChatMessageItemComponent
                key={message._id}
                message={message}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </Scrollbar>
      )}

      {messages?.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-4 border-b border-color">
          <div className="text-center flex flex-col justify-center items-center">
            <img src={editorNoMessages} className="w-36" />

            <h3 className="text-lg font-medium main-color mb-2">
              No messages yet
            </h3>
            <p className="text-sm main-color">
              Start a conversation with the AI assistant
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessagesComponent;
