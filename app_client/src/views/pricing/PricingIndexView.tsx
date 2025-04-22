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
      <div className="bg-white p-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pay-as-you-go
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Buy credits &gt; Use the AI Assistant
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {products?.products?.map((product: ProductType) => (
            <div key={product._id} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{product.title}</h2>
                <p className="mt-4 text-sm text-gray-500">{product.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${product.price}</span>
                  <span className="text-base font-medium text-gray-500">/one-time</span>
                </p>
                <button
                  onClick={() => navigate("/products?category=credit")}
                  className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-semibold text-gray-900 tracking-wide uppercase">What's included</h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">{product.noOfCredits} Chat Completions</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Code Completion</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Code-base aware assistant</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Frequently asked questions
          </h2>
          <div className="mt-12 max-w-3xl mx-auto divide-y divide-gray-200">
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
              <div className="pt-6">
                <dt className="text-lg">
                  <button className="text-left w-full flex justify-between items-start text-gray-400">
                    <span className="font-medium text-gray-900">Can I get a refund?</span>
                    <span className="ml-6 h-7 flex items-center">
                      <svg className="h-6 w-6 transform rotate-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </dt>
                <dd className="mt-2 pr-12">
                  <p className="text-base text-gray-500">
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
