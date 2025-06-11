import { useIsAuthorized } from "../hooks/useUser";
import { Link } from "react-router-dom";
import { JSX, useState } from "react";
import editorAvatar from "../assets/editorAvatar.png";
import { MenuIcon } from "lucide-react";

interface LayoutComponentProps {
  pageName: string;
  slot: JSX.Element;
}

function LayoutComponent(props: LayoutComponentProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data: isAuthorized } = useIsAuthorized();

  return (
    <>
      <div
        className="flex justify-between gap-3 text-black px-2"
        style={{
          background: "linear-gradient(135deg, #FFD700, #FF8C00, #FF4500)",
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 10s ease infinite",
        }}
      >
        <div className="flex gap-2 items-center">
          <img src={editorAvatar} className="w-8 h-8" />
          <h1 className="font-bold">Palm Editor</h1>
        </div>
        <div>
          <nav className="gap-1 hidden md:flex">
            <Link
              to="/"
              className={`p-2 hover:underline ${
                props.pageName == "home" ? "underline" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className={`p-2 hover:underline ${
                props.pageName == "pricing" ? "underline" : ""
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/features"
              className={`p-2 hover:underline ${
                props.pageName == "features" ? "underline" : ""
              }`}
            >
              Features
            </Link>
            <Link
              to="/docs"
              className={`p-2 hover:underline ${
                props.pageName == "docs" ? "underline" : ""
              }`}
            >
              Docs
            </Link>
            {!isAuthorized && (
              <>
                <Link to="/user/login" className="p-2 hover:underline">
                  Login
                </Link>
                <Link to="/user/signup" className="p-2 hover:underline">
                  Signup
                </Link>
              </>
            )}
            {isAuthorized && (
              <Link to="/user" className="p-2 hover:underline">
                Profile
              </Link>
            )}
            <Link
              to="https://github.com/niiicolai/ai-editor/releases"
              className="p-2 hover:underline bg-yellow-500 border-l border-r border-black text-black"
              target="_blank"
            >
              Download
            </Link>
          </nav>
          <nav className="gap-1 flex md:hidden">
            <button
              className="p-3 cursor-pointer text-black hover:text-gray-800"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <MenuIcon className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>
      <div
        className={`${
          showMobileMenu ? "flex" : "hidden"
        } fixed top-0 right-0 bottom-0 w-48 flex-col gap-0 z-50 border-l border-black`}
        style={{
          background: "linear-gradient(135deg, #FFD700, #FF8C00, #FF4500)",
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 10s ease infinite",
        }}
      >
        <Link
          to="/"
          className={`p-2 hover:underline ${
            props.pageName == "home" ? "underline" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/pricing"
          className={`p-2 hover:underline ${
            props.pageName == "pricing" ? "underline" : ""
          }`}
        >
          Pricing
        </Link>
        <Link
          to="/features"
          className={`p-2 hover:underline ${
            props.pageName == "features" ? "underline" : ""
          }`}
        >
          Features
        </Link>
        <Link
          to="/docs"
          className={`p-2 hover:underline ${
            props.pageName == "docs" ? "underline" : ""
          }`}
        >
          Docs
        </Link>
        {!isAuthorized && (
          <>
            <Link to="/user/login" className="p-2 hover:underline">
              Login
            </Link>
            <Link to="/user/signup" className="p-2 hover:underline">
              Signup
            </Link>
          </>
        )}
        {isAuthorized && (
          <Link to="/user" className="p-2 hover:underline">
            Profile
          </Link>
        )}
        <Link
          to="https://github.com/niiicolai/ai-editor/releases"
          className="p-2 hover:underline bg-yellow-500 text-black"
          target="_blank"
        >
          Download
        </Link>
        <button
              className="p-2 cursor-pointer text-center text-black hover:text-gray-800"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                Close
            </button>
      </div>

      {props.slot}
    </>
  );
}

export default LayoutComponent;
