import { Link, useSearchParams } from "react-router-dom";
import { useGetProducts } from "../../hooks/useProduct";
import { ProductType } from "../../types/productType";
import { useUpdateCheckout, useGetOrCreateCheckout } from "../../hooks/useCheckout";
import { useState } from "react";
import CartComponent from "../../components/CartComponent";
import RestrictedComponent from "../../components/RestrictedComponent";

function ProductIndexView() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { data: products, isLoading, error: productsError } = useGetProducts(1, 10, category || 'credit');
  const { data: checkout, isLoading: isLoadingCheckout, error: checkoutError } = useGetOrCreateCheckout();
  const { mutateAsync: updateCheckout, isPending: updateIsPending, error: updateCheckoutError } = useUpdateCheckout();
  const [cartError, setCartError] = useState<string | null>(null);

  const addProduct = async (product: ProductType, quantity: number = 1) => {
    if (!checkout) {
      setCartError("Unable to add product: Cart not found");
      return;
    }

    try {
      // Create a new array with the updated products
      const updatedProducts = [...(checkout.products.map(p => {
        return { product: p.product._id, quantity: p.quantity }
      }) || [])];
      const existingProductIndex = updatedProducts.findIndex(p => p.product === product._id);

      if (existingProductIndex >= 0) {
        // Update quantity if product exists
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: updatedProducts[existingProductIndex].quantity + quantity
        };
      } else {
        // Add new product if it doesn't exist
        updatedProducts.push({ product: product._id, quantity });
      }

      // Update the checkout
      await updateCheckout({
        _id: checkout._id,
        products: updatedProducts as [{ product: string; quantity: number }]
      });

      setCartError(null);
    } catch (err) {
      setCartError(err instanceof Error ? err.message : "Failed to add product to cart");
    }
  };

  if (isLoading || isLoadingCheckout) {
    return (
      <RestrictedComponent slot={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      } />
    );
  }

  if (productsError || checkoutError) {
    return (
      <RestrictedComponent slot={
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
    <RestrictedComponent slot={
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          {cartError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{cartError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cart Component */}
          <div className="mb-12 flex justify-between">
            <CartComponent />

            <Link
              to="/user"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Profile
            </Link>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choose Your Credit Package
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Select the perfect credit package for your AI Assistant
            </p>
          </div>

          {/* Products Grid */}
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
                    onClick={() => addProduct(product)}
                    disabled={updateIsPending}
                    className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateIsPending ? 'Adding to cart...' : `Add ${product.title} to cart`}
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
                      <span className="text-sm text-gray-500">Code-base aware assisant</span>
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
      </div>
    } />
  );
}

export default ProductIndexView;
