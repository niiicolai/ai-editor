import ChatComponent from "../components/chat/ChatComponent";
import SessionsComponent from "../components/sessions/SessionsComponent";
import HierarchyComponent from "../components/hierarchy/HierarchyComponent";
import TerminalComponent from "../components/terminal/TerminalComponent";
import HeaderComponent from "../components/header/HeaderComponent";
import FooterComponent from "../components/footer/FooterComponent";
import EditorCodeComponent from "../components/editor/EditorCodeComponent";
import EditorTabsComponent from "../components/editor/EditorTabsComponent";
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
    <div className="flex flex-col justify-between h-screen">
      <header className="p-2 border-color border-b main-bgg">
        <HeaderComponent />
      </header>
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="h-full w-96 relative main-bgg text-white">
          <div className="h-full w-96 w-full flex-1 flex flex-col">
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

        <div className="flex-1 flex">
          <div className="h-full w-full flex-1 flex flex-col border-r border-color main-bgg">
            <EditorTabsComponent />
            <EditorCodeComponent />
            {!terminalDisabled && <TerminalComponent />}
          </div>
        </div>

        <HierarchyComponent />
      </div>
      <footer className="p-3 border-color border-t main-bgg">
        <FooterComponent />
      </footer>
    </div>
  );
}

export default EditorView;
