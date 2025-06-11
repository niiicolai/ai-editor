import { useNavigate } from "react-router-dom";
import editor404 from "../../assets/editor404.png";

export default function NotFoundView() {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col items-center justify-center text-center p-8 font-sans min-h-screen"
            style={{
                background: "linear-gradient(135deg, #FFD700, #FF8C00, #FF4500)",
                backgroundSize: "400% 400%",
                animation: "gradientAnimation 10s ease infinite",
            }}
        >
            <img src={editor404} alt="404 Not Found" className="max-w-xs w-full mb-4" />
            <h1 className="text-2xl font-bold text-gray-800" data-testid="error-title">Oops! Page Not Found</h1>
            <p className="text-base text-gray-600 mb-6">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <button
                data-testid="error-back-link"
                className="px-6 py-3 text-black bg-yellow-500 border border-black rounded hover:bg-yellow-600 cursor-pointer"
                onClick={() => navigate("/")}
            >
                Go Back Home
            </button>
            <style>
                {`
                    @keyframes gradientAnimation {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}
            </style>
        </div>
    );
}
