import { useParams } from "react-router-dom";
import { useGetCheckout } from "../../hooks/useCheckout";
import { Link } from "react-router-dom";
import RestrictedComponent from "../../components/RestrictedComponent";

function CheckoutShowView() {
  const { _id } = useParams();
  const { data: checkout, isLoading, error } = useGetCheckout(_id as string);

  if (isLoading) {
    return (
      <RestrictedComponent slot={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      } />
    );
  }

  if (error) {
    return (
      <RestrictedComponent slot={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p className="text-lg">Error loading checkout</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        </div>
      } />
    );
  }

  const total = checkout?.products.reduce((sum, item) => sum + (item.quantity * item.product.price), 0) || 0;

  return (
    <RestrictedComponent slot={
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Checkout Details</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Order placed on {checkout?.created_at}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${checkout?.state === 'purchased'
                    ? 'bg-green-100 text-green-800'
                    : checkout?.state === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {checkout?.state}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{checkout?._id}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {checkout?.state}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {checkout?.products.map((item) => (
                  <li key={item.product._id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.product.title}</div>
                          <div className="text-sm text-gray-500">${item.product.price} each</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-900">
                        ${(item.quantity * item.product.price).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end">
            <Link
              to="/checkouts"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    } />
  );
}

export default CheckoutShowView;
