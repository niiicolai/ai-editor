import LayoutComponent from "../../components/LayoutComponent";
import researchImage from "../../assets/research.png";
import debugImage from "../../assets/debug.png";
import searchImage from "../../assets/search.png";

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
          <div className="bg-gradient-to-br from-indigo-50 to-white">
            <div className="py-16 sm:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                    Features
                  </h2>
                  <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    Everything You Need to Code Smarter
                  </p>
                  <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    A powerful toolkit designed for developers who value speed,
                    clarity, and efficiency.
                  </p>
                </div>

                <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-2">
                  {/* Feature */}
                  {features.map((feature, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white transition-transform duration-300 group-hover:scale-110">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {feature.icon}
                        </svg>
                      </div>
                      <div className="ml-16">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-base text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

            <div className="mb-12">
            <div className="text-center mt-12 mb-12">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              AI Assistant
              </h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Seamless Assistance Within Your Codebase
              </p>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Empower your workflow with an intelligent chat interface designed for advanced, multi-step AI-driven actions.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 shadow-md bg-slate-200 p-3 rounded-lg">
              <h3 className="text-2xl font-semibold text-center">Research</h3>
              <p className="text-base text-center text-gray-700">
                Leverage AI to analyze and extract insights from your projects, accelerating discovery and understanding.
              </p>
              <img
                src={researchImage}
                alt="AI-powered project research"
                className="w-full h-full rounded"
              />
              </div>
              <div className="flex flex-col gap-3 shadow-md bg-slate-200 p-3 rounded-lg">
              <h3 className="text-2xl font-semibold text-center">Search</h3>
              <p className="text-base text-center text-gray-700">
                Instantly locate features, files, or code snippets using intelligent, context-aware search capabilities.
              </p>
              <img
                src={searchImage}
                alt="AI-powered project search"
                className="w-full h-full rounded"
              />
              </div>
              <div className="flex flex-col gap-3 shadow-md bg-slate-200 p-3 rounded-lg">
              <h3 className="text-2xl font-semibold text-center">Debug</h3>
              <p className="text-base text-center text-gray-700">
                Identify and resolve issues efficiently with AI-assisted debugging and error detection.
              </p>
              <img
                src={debugImage}
                alt="AI-powered project debugging"
                className="w-full h-full rounded"
              />
              </div>
            </div>
            </div>
        </>
      }
    />
  );
}

export default FeaturesIndexView;
