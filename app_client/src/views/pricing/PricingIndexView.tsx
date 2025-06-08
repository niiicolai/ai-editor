import LayoutComponent from "../../components/LayoutComponent";
import { useGetProducts } from "../../hooks/useProduct";
import { ProductType } from "../../types/productType";
import { useNavigate } from "react-router-dom";

function PricingIndexView() {
  const category = 'credit';
  const page = 1;
  const limit = 10;
  const { data: products, isLoading, error } = useGetProducts(page, limit, category);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <LayoutComponent pageName="pricing" slot={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      } />
    );
  }

  if (error) {
    return (
      <LayoutComponent pageName="pricing" slot={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p className="text-lg">Error loading products</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        </div>
      } />
    );
  }

  return (
    <LayoutComponent pageName="pricing" slot={
      <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-20 min-h-screen">
        <div className="text-center mb-12">
          <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">
            Pay-as-you-go Credits
          </h2>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl" data-testid="pricing-title">
            Buy Credits & Use the AI Assistant
          </p>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Purchase credits for chat completions, code completion, and a codebase-aware assistant.<br />
            <span className="text-cyan-400">No subscriptions. Pay only for what you use.</span>
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative max-w-4xl w-full">
            <div className="absolute -inset-4 bg-cyan-500 rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products?.products?.map((product: ProductType) => (
                <div key={product._id} className="bg-[#18192a] border border-cyan-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
                  <h2 className="text-lg font-bold text-white">{product.title}</h2>
                  <p className="mt-2 text-sm text-gray-300 text-center">{product.description}</p>
                  <p className="mt-6">
                    <span className="text-4xl font-extrabold text-cyan-300">${product.price}</span>
                    <span className="text-base font-medium text-gray-400"> / one-time</span>
                  </p>
                  <button
                    onClick={() => navigate("/products?category=credit")}
                    className="mt-8 w-full bg-cyan-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy
                  </button>
                  <div className="mt-8 w-full">
                    <h3 className="text-xs font-semibold text-cyan-200 tracking-wide uppercase mb-2">What's included</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-300">{product.noOfCredits} Credit</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-300">Code Completion</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-300">Code-base aware assistant</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center">
            Frequently asked questions
          </h2>
          <div className="mt-12 divide-y divide-gray-700 bg-[#23243a] rounded-2xl shadow-lg">
            <dl className="mt-6 space-y-6 divide-y divide-gray-700">
              <div className="pt-6 px-8">
                <dt className="text-lg">
                  <button className="text-left w-full flex justify-between items-start text-cyan-400">
                    <span className="font-medium text-white">Can I get a refund?</span>
                    <span className="ml-6 h-7 flex items-center">
                      <svg className="h-6 w-6 transform rotate-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </dt>
                <dd className="mt-2 pr-12">
                  <p className="text-base text-gray-300 pb-4">
                    We offer a 30-day money-back guarantee for unused credits. Once credits are used for the AI Assistant, they cannot be refunded.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

    } />
  )
}

export default PricingIndexView;
