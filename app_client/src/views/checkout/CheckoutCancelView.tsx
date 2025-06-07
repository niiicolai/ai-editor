import { Link } from "react-router-dom";

function CheckoutCancelView() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen">
      <div className="max-w-md mx-auto bg-white/90 rounded-2xl shadow-2xl p-10 backdrop-blur-md border border-gray-200">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
          Checkout Cancelled
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your checkout has been cancelled. You can return to the{" "}
          <Link
            to="/products"
            className="font-medium text-cyan-700 hover:text-cyan-600 transition duration-200"
          >
            product listing
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default CheckoutCancelView;
