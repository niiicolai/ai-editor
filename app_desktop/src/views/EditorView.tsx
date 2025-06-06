import HierarchyComponent from "../components/hierarchy/HierarchyComponent";
import ChatComponent from "../components/chat/ChatComponent";
import SessionsComponent from "../components/sessions/SessionsComponent";
import TerminalComponent from "../components/terminal/TerminalComponent";
import HeaderComponent from "../components/header/HeaderComponent";
import FooterComponent from "../components/footer/FooterComponent";
import EditorCodeComponent from "../components/editor/EditorCodeComponent";
import EditorTabsComponent from "../components/editor/EditorTabsComponent";
import SearchComponent from "../components/search/SearchComponent";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useIsAuthorized } from "../hooks/useUser";
import { Link } from "react-router-dom";
import { ChevronRight, Lock } from "lucide-react";
import { userAgentSessionSettingsActions } from "../features/userAgentSessionSettings";

function EditorView() {
  const { data: isAuthorized } = useIsAuthorized();
  const { sessionId } = useSelector(
    (state: RootState) => state.userAgentSession
  );
  const { responsiveActive, minimized } = useSelector(
    (state: RootState) => state.userAgentSessionSettings
  );
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col justify-between h-screen">
      <HeaderComponent />
      <SearchComponent />

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {minimized && (
          <div
            className={`h-full flex-col justify-center main-bgg text-white border-r border-color p-1 ${
              minimized ? "hidden lg:flex" : "hidden"
            }`}
          >
            <button
              onClick={() =>
                dispatch(userAgentSessionSettingsActions.setMinimized(false))
              }
              className="inline-flex items-center border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 hidden lg:block" />
            </button>
          </div>
        )}
        <div
            className={`hidden absolute left-0 right-0 bottom-0 top-0 lg:static lg:h-full main-bgg text-white lg:block ${minimized ? "lg:hidden" : ""} ${
              isAuthorized ? "w-full lg:w-96" : ""
            }`}
            style={responsiveActive ? { display: "block", zIndex: 99 } : {}}
          >
            <div
              className={`h-full flex-1 flex flex-col ${
                isAuthorized ? "lg:w-96" : ""
              }`}
            >
              {isAuthorized && sessionId && <ChatComponent />}
              {isAuthorized && !sessionId && <SessionsComponent />}
              {!isAuthorized && (
                <div
                  className={`h-full flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-auto lg:justify-end border-r border-color`}
                >
                  <p className="lg:hidden text-sm text-white text-center">
                    Please login to access the AI Assistant
                    <br /> by clicking the lock icon.
                  </p>

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
       

        <div className="flex-1 flex h-full">
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
