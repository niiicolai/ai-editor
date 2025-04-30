import ChatComponent from "../components/chat/ChatComponent";
import SessionsComponent from "../components/sessions/SessionsComponent";
import HierarchyComponent from "../components/hierarchy/HierarchyComponent";
import TerminalComponent from "../components/terminal/TerminalComponent";
import HeaderComponent from "../components/header/HeaderComponent";
import FooterComponent from "../components/footer/FooterComponent";
import EditorCodeComponent from "../components/editor/EditorCodeComponent";
import EditorTabsComponent from "../components/editor/EditorTabsComponent";
import SearchComponent from "../components/search/SearchComponent";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useIsAuthorized } from "../hooks/useUser";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

function EditorView() {
  const { data: isAuthorized } = useIsAuthorized();  
  const { sessionId } = useSelector((state: RootState) => state.userAgentSession);

  return (
    <div className="flex flex-col justify-between h-screen">
      <HeaderComponent />
      <SearchComponent />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className={`h-full relative main-bgg text-white ${isAuthorized ? 'lg:w-96' : ''}`}>
          <div className={`h-full flex-1 flex flex-col ${isAuthorized ? 'lg:w-96' : ''}`}>
            {isAuthorized && sessionId && <ChatComponent />}
            {isAuthorized && !sessionId && <SessionsComponent />}
            {!isAuthorized && (
              <div className={`h-full flex items-center justify-end border-r border-color`}>
                <Link
                  title="Login"
                  to="/user/login"
                  className="button-main p-1 text-sm rounded-md"
                >
                  <Lock className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="h-full w-full flex-1 flex flex-col border-r border-color main-bgg">
            <EditorTabsComponent />
            <EditorCodeComponent />
            <TerminalComponent />
          </div>
        </div>

        <HierarchyComponent />
      </div>
      
      <FooterComponent />
    </div>
  );
}

export default EditorView;
