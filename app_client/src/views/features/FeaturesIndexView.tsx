import LayoutComponent from "../../components/LayoutComponent";
import researchImage from "../../assets/research.png";
import debugImage from "../../assets/debug.png";
import searchImage from "../../assets/search.png";
import refactorImage from "../../assets/refactor.png";
import editorMonacoImage from "../../assets/editorMonaco.png";
import editorProjectIndexImage from "../../assets/editorProjectIndex.png";
import editorTerminalImage from "../../assets/editorTerminal.png";
import editorChatModeImage from "../../assets/editorChatMode.png";
import editorLLMModeImage from "../../assets/editorLLMMode.png";
import editorOfflineModeImage from "../../assets/editorOfflineMode.png";

function FeaturesIndexView() {
  const features = [
    {
      title: "Retrieval Augmented Generation",
      description:
        "Advanced indexing and retrieval capabilities to enhance your AI Assistant's performance.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      title: "Add Specific Files or Lines to Chat",
      description:
        "Easily include specific files or code lines in your AI conversations for context.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      ),
    },
    {
      title: "AI-Powered Tooling",
      description:
        "Leverage AI to automate repetitive tasks and enhance your coding workflow.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      ),
    },
    {
      title: "Conversations with Context",
      description:
        "Get context-aware responses from your AI Assistant, making interactions more relevant and efficient.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      ),
    },
  ];

  return (
    <LayoutComponent
      pageName="features"
      slot={
        <>
          {/* Hero Section with Glowing Blobs */}
          <div className="bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Glowing background blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-cyan-500 opacity-30 blur-3xl z-0"></div>
            <div className="pointer-events-none absolute top-1/2 right-0 w-[350px] h-[350px] rounded-full bg-purple-600 opacity-30 blur-3xl z-0"></div>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[250px] h-[250px] rounded-full bg-orange-400 opacity-20 blur-2xl z-0"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase" data-testid="features-title">
                  Features
                </h2>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-lg">
                  Everything You Need to Code Smarter
                </p>
                <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                  A powerful toolkit designed for developers who value speed,
                  clarity, and efficiency.
                </p>
              </div>
              <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-2">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="relative group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 overflow-hidden hover:scale-[1.03] transition-transform duration-300"
                  >
                    {/* Glowing icon background */}
                    <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-cyan-500 opacity-20 blur-2xl z-0"></div>
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-purple-500 opacity-20 blur-2xl z-0"></div>
                    <div className="relative flex items-center justify-center h-12 w-12 rounded-md bg-cyan-600 text-white shadow-lg z-10 transition-transform duration-300 group-hover:scale-110">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {feature.icon}
                      </svg>
                    </div>
                    <div className="ml-0 mt-4 relative z-10">
                      <h3 className="text-2xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
            <div className="text-center mb-12">
              <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">
                AI Assistant
              </h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Seamless Assistance Within Your Codebase
              </p>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Empower your workflow with an intelligent chat interface
                designed for advanced, multi-step AI-driven actions.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 shadow-lg bg-gray-800/80 p-6 rounded-xl border border-cyan-900 hover:shadow-cyan-700/30 transition-shadow">
                <h3 className="text-2xl font-semibold text-center text-cyan-300">
                  Research
                </h3>
                <p className="text-base text-center text-gray-300">
                  Leverage AI to analyze and extract insights from your
                  projects, accelerating discovery and understanding.
                </p>
                <img
                  src={researchImage}
                  alt="AI-powered project research"
                  className="w-full rounded-lg shadow"
                />
              </div>
              <div className="flex flex-col gap-3 shadow-lg bg-gray-800/80 p-6 rounded-xl border border-cyan-900 hover:shadow-cyan-700/30 transition-shadow">
                <h3 className="text-2xl font-semibold text-center text-cyan-300">
                  Search
                </h3>
                <p className="text-base text-center text-gray-300">
                  Instantly locate features, files, or code snippets using
                  intelligent, context-aware search capabilities.
                </p>
                <img
                  src={searchImage}
                  alt="AI-powered project search"
                  className="w-full rounded-lg shadow"
                />
              </div>
              <div className="flex flex-col gap-3 shadow-lg bg-gray-800/80 p-6 rounded-xl border border-cyan-900 hover:shadow-cyan-700/30 transition-shadow">
                <h3 className="text-2xl font-semibold text-center text-cyan-300">
                  Debug
                </h3>
                <p className="text-base text-center text-gray-300">
                  Identify and resolve issues efficiently with AI-assisted
                  debugging and error detection.
                </p>
                <img
                  src={debugImage}
                  alt="AI-powered project debugging"
                  className="w-full rounded-lg shadow"
                />
              </div>
              <div className="flex flex-col gap-3 shadow-lg bg-gray-800/80 p-6 rounded-xl border border-cyan-900 hover:shadow-cyan-700/30 transition-shadow">
                <h3 className="text-2xl font-semibold text-center text-cyan-300">
                  Refactor
                </h3>
                <p className="text-base text-center text-gray-300">
                  Optimize your codebase with AI-driven refactoring suggestions
                  and improvements.
                </p>
                <img
                  src={refactorImage}
                  alt="AI-powered project refactoring"
                  className="w-full rounded-lg shadow"
                />
              </div>
            </div>
          </div>

          {/* Monaco Editor Integration Section */}
          <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-20">
            <div className="text-center mb-12">
              <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">
                Monaco Editor Integration with Custom Tabs
              </h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Use the Power of Monaco Editor
              </p>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Experience a fully integrated Monaco Editor with custom tabs for
                enhanced coding efficiency and flexibility.
                <br />
                <a
                  href="https://microsoft.github.io/monaco-editor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline hover:text-cyan-300 transition-colors ml-1"
                >
                  Learn more about Monaco Editor
                </a>
              </p>
            </div>
            <div className="flex justify-center mb-12">
              <div className="relative max-w-4xl w-full">
                <div className="absolute -inset-4 bg-cyan-500 rounded-2xl blur-2xl opacity-20"></div>
                <img
                  src={editorMonacoImage}
                  alt="Monaco Editor with custom tabs"
                  className="relative max-w-full h-auto rounded-2xl shadow-2xl border-2 border-cyan-700"
                />
              </div>
            </div>
          </div>

          {/* Project Index & Retrieval Augmented Generation (RAG) Section */}
          <div className="bg-gradient-to-br from-[#232526] via-[#414345] to-[#232526] py-20">
            <div className="text-center mb-12">
              <h2 className="text-base text-orange-400 font-semibold tracking-wide uppercase">
                Project Index & Retrieval Augmented Generation (RAG)
              </h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Next-Level Context Awareness & Navigation
              </p>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Instantly explore your codebase and supercharge your AI
                Assistant with a built-in database, vector search, and smart
                code parsing. All embeddings, code, and Q&A are stored locally
                for privacy. When you chat with the AI, it retrieves the most
                relevant code and docs for your queries—no more copy-paste.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto px-4">
              <div className="flex-1 flex flex-col items-center">
                <img
                  src={editorProjectIndexImage}
                  alt="Project Index and RAG"
                  className="rounded-2xl shadow-2xl border-2 border-orange-400 bg-gray-900 max-w-full"
                />
              </div>
              <div className="flex-1 mt-8 lg:mt-0">
                <div className="bg-gradient-to-br from-orange-900/60 to-gray-900/80 rounded-xl p-8 shadow-lg border border-orange-700">
                  <h3 className="text-2xl font-bold text-orange-300 mb-4">
                    How It Works
                  </h3>
                  <ul className="list-disc list-inside text-gray-200 space-y-2">
                    <li>
                      <span className="text-orange-400 font-semibold">
                        Built-in database with vector search:
                      </span>{" "}
                      Enables lightning-fast, privacy-preserving code and doc
                      retrieval.
                    </li>
                    <li>
                      <span className="text-orange-400 font-semibold">
                        Smart code parsing for Q&A:
                      </span>{" "}
                      Focused on answering questions about your code’s content.
                    </li>
                    <li>
                      <span className="text-orange-400 font-semibold">
                        Local storage for privacy:
                      </span>{" "}
                      All embeddings, code, and Q&A data stay on your machine.
                    </li>
                    <li>
                      <span className="text-orange-400 font-semibold">
                        Context-aware AI chat:
                      </span>{" "}
                      Every message you send triggers a search for the most
                      relevant files and snippets, which are sent to the LLM for
                      accurate answers.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Section */}
          <div className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] py-20">
            <div className="text-center mb-12">
              <h2 className="text-base text-purple-400 font-semibold tracking-wide uppercase">
                Integrated Terminal
              </h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Command Line, Reimagined
              </p>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Run commands, scripts, and interact with your environment—all
                within your editor. The terminal is tightly integrated for a
                seamless, productive workflow.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative max-w-4xl w-full flex justify-center items-center mx-auto">
                <div className="absolute -inset-4 bg-purple-500 rounded-2xl blur-2xl opacity-20"></div>
                <img
                  src={editorTerminalImage}
                  alt="Integrated Terminal"
                  className="relative max-w-full h-auto rounded-2xl shadow-2xl border-2 border-purple-700 mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Chat Modes & LLM Selection Section */}
          <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-20">
            <div className="text-center mb-12">
              <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">
                Flexible Chat Modes & LLM Selection
              </h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Choose How You Interact with AI
              </p>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Switch between{" "}
                <span className="text-cyan-300 font-semibold">'ask'</span> and{" "}
                <span className="text-purple-300 font-semibold">'agent'</span>{" "}
                chat modes to match your workflow.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-start justify-start gap-12 max-w-6xl mx-auto px-4">
              {/* Chat Mode */}
              <div className="flex-1 flex flex-col items-center">
                <img
                  src={editorChatModeImage}
                  alt="Ask Mode"
                  className="rounded-2xl shadow-2xl border-2 border-cyan-400 bg-gray-900 max-w-full mb-6"
                />
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">
                  Choose Chat Mode
                </h3>
                <p className="text-base text-gray-200 text-center mb-4">
                  Use <span className="font-semibold text-cyan-300">'ask'</span>{" "}
                  for quick questions and answers, powered by Retrieval
                  Augmented Generation (RAG).
                  <br />
                  Switch to{" "}
                  <span className="font-semibold text-purple-300">
                    'agent'
                  </span>{" "}
                  for advanced AI capabilities. The agent can read files, search
                  across your project, and list directories—enabling powerful,
                  multi-step actions directly in your workspace.
                </p>
                <div className="mt-auto w-full">
                  <h4 className="text-lg font-semibold text-cyan-200 mb-1 text-center">
                    Supported Events
                  </h4>
                  <ul className="text-gray-300 text-center space-y-1">
                    <li>
                      <span className="font-mono bg-cyan-900 text-cyan-200 px-2 py-1 rounded">
                        ask
                      </span>
                      <span className="ml-2 text-gray-400">(Ask Mode)</span>
                    </li>
                    <li>
                      <span className="font-mono bg-purple-900 text-purple-200 px-2 py-1 rounded">
                        read_file
                      </span>
                      <span className="ml-2 text-gray-400">(Agent Mode)</span>
                    </li>
                    <li>
                      <span className="font-mono bg-purple-900 text-purple-200 px-2 py-1 rounded">
                        list_dir
                      </span>
                      <span className="ml-2 text-gray-400">(Agent Mode)</span>
                    </li>
                  </ul>
                </div>
              </div>
              {/* LLM Mode */}
              <div className="flex-1 flex flex-col items-center">
                <img
                  src={editorLLMModeImage}
                  alt="Agent Mode"
                  className="rounded-2xl shadow-2xl border-2 border-purple-400 bg-gray-900 max-w-full mb-6"
                />
                <h3 className="text-2xl font-bold text-purple-300 mb-2">
                  Choose Your LLM
                </h3>
                <p className="text-base text-gray-200 text-center mb-4">
                  Select from multiple Large Language Models to fit your needs,
                  including{" "}
                  <span className="font-semibold text-cyan-300">
                    Gemini 2.0 Flash Lite
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-purple-300">
                    GPT-4o Mini
                  </span>
                  . Easily switch models for the best balance of speed and
                  accuracy.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <span className="bg-cyan-900 text-cyan-200 px-4 py-2 rounded-lg font-mono text-lg shadow">
                    Gemini 2.0 Flash Lite
                  </span>
                  <span className="bg-purple-900 text-purple-200 px-4 py-2 rounded-lg font-mono text-lg shadow">
                    GPT-4o Mini
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Offline Mode Section */}
          <div className="bg-gradient-to-br from-[#232526] via-[#414345] to-[#232526] py-20">
            <div className="text-center mb-12">
              <h2 className="text-base text-green-400 font-semibold tracking-wide uppercase">
                Offline Mode
              </h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Keep Coding, Even Offline
              </p>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                The editor fully supports offline mode. You can continue editing
                your code, navigating files, and using all non-AI features
                without an internet connection. Only AI-powered features require
                connectivity.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
              <img
                src={editorOfflineModeImage}
                alt="Offline Mode Editor"
                className="rounded-2xl shadow-2xl border-2 border-green-400 bg-gray-900 max-w-full"
              />
              <div className="mt-8 bg-gradient-to-br from-green-900/60 to-gray-900/80 rounded-xl p-8 shadow-lg border border-green-700 text-gray-200 text-center">
                <h3 className="text-2xl font-bold text-green-300 mb-4">
                  What Works Offline?
                </h3>
                <ul className="list-disc list-inside space-y-2 text-left max-w-xl mx-auto">
                  <li>
                    <span className="text-green-400 font-semibold">
                      Code editing:
                    </span>{" "}
                    All Monaco Editor features, file navigation, and project
                    management.
                  </li>
                  <li>
                    <span className="text-green-400 font-semibold">
                      Terminal:
                    </span>{" "}
                    Run commands and scripts locally.
                  </li>
                  <li>
                    <span className="text-green-400 font-semibold">
                      Project index & search:
                    </span>{" "}
                    Explore and search your codebase without AI.
                  </li>
                  <li>
                    <span className="text-green-400 font-semibold">
                      AI features:
                    </span>{" "}
                    Require an internet connection for chat, code generation,
                    and advanced assistance.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}

export default FeaturesIndexView;
