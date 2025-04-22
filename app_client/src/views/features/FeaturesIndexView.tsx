import LayoutComponent from "../../components/LayoutComponent";
import researchImage from "../../assets/research.png";
import debugImage from "../../assets/debug.png";
import searchImage from "../../assets/search.png";

function FeaturesIndexView() {
  const features = [
    {
      title: 'Intelligent Code Completion',
      description:
        'Context-aware suggestions that adapt to your project structure and habits.',
      iconPath:
        'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Real-time Refactoring',
      description:
        'Clean and optimize your code with AI-suggested improvements as you type.',
      iconPath:
        'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    },
    {
      title: 'Smart Debugging',
      description:
        'AI-powered bug detection and fixes, right when you need them.',
      iconPath:
        'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      title: 'Performance Insights',
      description:
        'Real-time metrics and optimization tips to keep your code blazing fast.',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
  ];

  return (
    <LayoutComponent pageName="features" slot={
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
                  A powerful toolkit designed for developers who value speed, clarity, and efficiency.
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={feature.iconPath}
                        />
                      </svg>
                    </div>
                    <div className="ml-16">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-600">{feature.description}</p>
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
              Get help directly within your code base
            </p>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              A powerful chat designed for multi-step AI actions
            </p>
          </div>
          <div className="flex gap-6 mx-auto w-1/2 justify-center overflow-hidden">
            <div className="flex flex-col gap-3 shadow-md bg-slate-200 p-3">
              <h3 className="text-3xl text-center">
                Research
              </h3>
              <p className="text-md text-center">
                Use the AI to uncover the features of your projects.
              </p>
              <img src={researchImage} alt="research project ai" className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-3 shadow-md bg-slate-200 p-3">
              <h3 className="text-3xl text-center">
                Search
              </h3>
              <p className="text-md text-center">
                Use the AI to search for project features.
              </p>
              <img src={searchImage} alt="search project ai" className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-3 shadow-md bg-slate-200 p-3">
              <h3 className="text-3xl text-center">
                Debug
              </h3>
              <p className="text-md text-center">
                Use the AI for finding errors.
              </p>
              <img src={debugImage} alt="debug project ai" className="w-full h-full" />
            </div>
          </div>
        </div>
      </>

    } />
  )
}

export default FeaturesIndexView;
