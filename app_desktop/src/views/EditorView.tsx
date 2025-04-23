import ChatComponent from "../components/chat/ChatComponent";
import SessionsComponent from "../components/sessions/SessionsComponent";
import HierarchyComponent from "../components/hierarchy/HierarchyComponent";
import EditorComponent from "../components/editor/EditorComponent";
import TerminalComponent from "../components/terminal/TerminalComponent";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useIsAuthorized } from "../hooks/useUser";
import { Link } from "react-router-dom";
import { Unlock } from "lucide-react";

function EditorView() {
  const { data: isAuthorized } = useIsAuthorized();
  const terminalDisabled = useSelector(
    (state: RootState) => state.editorSettings.terminal.disabled
  );
  const sessionId = useSelector(
    (state: RootState) => state.userAgentSession.sessionId
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="h-screen w-96 relative main-bgg text-white">
        <div className="h-screen w-96 w-full flex-1 flex flex-col">
          {isAuthorized && sessionId && <ChatComponent />}
          {isAuthorized && !sessionId && <SessionsComponent />}
          {!isAuthorized && (
            <div className="h-full flex items-center justify-end">
              <Link
                title="Login"
                to="/user/login"
                className="button-main p-1 text-sm rounded-md"
              >
                <Unlock className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex min-h-screen">
        <div className="flex h-screen w-full flex-1">
          <div className="w-full flex">
            <div className="w-full flex-1 flex flex-col border-r border-color main-bgg">
              <EditorComponent />
              {!terminalDisabled && <TerminalComponent />}
            </div>
          </div>
        </div>
      </div>

      <HierarchyComponent />      
    </div>
  );
}

export default EditorView;
