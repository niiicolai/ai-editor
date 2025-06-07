import { Link } from "react-router-dom";
import productImage from "../assets/editorRag.png";
import editorAstralVenomImage from "../assets/editorAstralVenom.png";
import editorCyberDriftImage from "../assets/editorCyberDrift.png";
import editorHighContrastLightImage from "../assets/editorHighContrastLight.png";
import editorOrangeEmberImage from "../assets/editorOrangeEmber.png";
import LayoutComponent from "../components/LayoutComponent";

function HomeView() {
  return (
    <LayoutComponent
      pageName="home"
      slot={
        <div className="bg-white">
          <div className="relative bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent blur-3xl z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 py-20">
              <div className="text-left space-y-6 lg:w-1/2">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                  AI-Powered Code Editor
                </h1>
                <p className="text-lg text-indigo-200">
                  Experience the future of coding with real-time AI assistance.
                </p>
                <div className="flex space-x-4 mt-6">
                  <Link
                    to="https://github.com/niiicolai/ai-editor/releases"
                    target="_blank"
                    className="px-6 py-3 text-base font-semibold rounded-lg border border-cyan-400 text-cyan-300 hover:bg-cyan-500 hover:text-white transition duration-200 backdrop-blur-md bg-white/5"
                  >
                    Get the Editor
                  </Link>
                  <Link
                    to="/features"
                    className="px-6 py-3 text-base font-semibold rounded-lg border border-transparent bg-cyan-700 text-white hover:bg-cyan-600 transition duration-200"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              <div className="relative lg:w-1/2 mt-10 lg:mt-0">
                <img
                  src={productImage}
                  alt="Editor preview"
                  className="rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>

          <div
            className="py-12 flex gap-12 items-start py-24"
            style={{
              background:
                "linear-gradient(135deg,rgb(11, 10, 12),rgb(15, 15, 20),rgb(11, 8, 17))",
              backgroundSize: "400% 400%",
              animation: "gradientAnimation 10s ease infinite",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
              <div className="lg:text-center">
                <h2 className="text-base text-cyan-500 font-semibold tracking-wide uppercase">
                  Features
                </h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-cyan-500 sm:text-4xl">
                  Everything you need to code smarter
                </p>
              </div>

              <div>
                <div className="grid gap-10 md:grid-cols-2 mt-10">
                  {[
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
                  ].map(({ title, description, icon }, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {icon}
                        </svg>
                      </div>
                      <div className="ml-16">
                        <h3 className="text-lg leading-6 font-medium text-gray-200">
                          {title}
                        </h3>
                        <p className="mt-2 text-base text-gray-200">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold text-white text-center">
                Choose Your Theme
              </h2>
              <p className="mt-4 text-lg text-gray-400 text-center">
                Customize your coding experience with our beautiful themes.
              </p>
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { src: editorAstralVenomImage, alt: "Astral Venom" },
                  { src: editorCyberDriftImage, alt: "Cyber Drift" },
                  {
                    src: editorHighContrastLightImage,
                    alt: "High Contrast Light",
                  },
                  { src: editorOrangeEmberImage, alt: "Orange Ember" },
                ].map((theme, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <img
                      src={theme.src}
                      alt={theme.alt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {theme.alt}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block text-white">
                  Ready to experience the future of coding?
                </span>
                <span className="block text-cyan-600">
                  Start coding with AI today.
                </span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="https://github.com/niiicolai/ai-editor/releases"
                    target="_blank"
                    className="inline-flex items-center justify-center px-5 py-3 border border-cyan-500 text-base font-medium rounded-md text-cyan-500 bg-transparent hover:border-cyan-700"
                  >
                    Download Editor
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link
                    to="/docs"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-700 hover:bg-cyan-50"
                  >
                    View Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default HomeView;
