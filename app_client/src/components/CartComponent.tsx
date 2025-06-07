import { useGetOrCreateCheckout, useUpdateCheckout, useStartCheckout } from "../hooks/useCheckout";
import { CheckoutProductType } from "../types/checkoutType";
import { useState } from "react";

function CartComponent() {
    const [cartError, setCartError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { data: checkout, isLoading, error } = useGetOrCreateCheckout();
    const { mutateAsync: updateCheckout } = useUpdateCheckout();
    const { mutateAsync: startCheckout, isPending: startIsPending } = useStartCheckout();
    const productQueries = checkout?.products || [];

    const removeProduct = async (_id: string, quantity: number = 1) => {
        if (!checkout) {
            setCartError("Unable to remove product: Cart not found");
            return;
        }

        try {
            // Create a new array with the updated products
            const updatedProducts = [...(checkout.products.map(p=> {
                return { product: p.product._id, quantity: p.quantity }
              }) || [])];
            const existingProductIndex = updatedProducts.findIndex(p => p.product === _id);

            if (existingProductIndex >= 0) {
                const newQuantity = updatedProducts[existingProductIndex].quantity - quantity;
                
                if (newQuantity <= 0) {
                    // Remove the product if quantity becomes 0 or negative
                    updatedProducts.splice(existingProductIndex, 1);
                } else {
                    // Update quantity if product still exists
                    updatedProducts[existingProductIndex] = {
                        ...updatedProducts[existingProductIndex],
                        quantity: newQuantity
                    };
                }
            }

            // Update the checkout
            await updateCheckout({
                _id: checkout._id,
                products: updatedProducts as [{ product: string; quantity: number }]
            });

            setCartError(null);
        } catch (err) {
            setCartError(err instanceof Error ? err.message : "Failed to remove product from cart");
        }
    };

    const handleCheckout = async () => {
        if (!checkout) {
            setCartError("Unable to start checkout: Cart not found");
            return;
        }

        try {
            const url = await startCheckout(checkout._id);
            window.location.href = url;
        } catch (err) {
            setCartError(err instanceof Error ? err.message : "Failed to start checkout");
        }
    };

    if (isLoading) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </button>
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-10">
                    <div className="p-4 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </button>
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-10">
                    <div className="p-4 text-red-500 text-center">
                        <p className="text-sm">Error loading cart</p>
                    </div>
                </div>
            </div>
        );
    }

    const itemCount = checkout?.products?.length || 0;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
            >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-10">
                    {cartError && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-400">
                            <p className="text-sm text-red-700">{cartError}</p>
                        </div>
                    )}
                    {itemCount === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-sm text-gray-500">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="max-h-96 overflow-y-auto p-4">
                                <ul className="divide-y divide-gray-200">
                                    {productQueries.map((product: CheckoutProductType) => {
                                        return (
                                            <li key={product.product._id} className="py-3">
                                                <div className="flex items-center">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {product.product.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {product.quantity} × ${product.product.price}
                                                        </p>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        <button
                                                            onClick={() => removeProduct(product.product._id)}
                                                            className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="border-t border-gray-200 p-4">
                                <div className="flex justify-between text-sm font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>${productQueries.reduce((sum, product) => sum + (product.quantity * product.product.price), 0).toFixed(2)}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={handleCheckout}
                                        disabled={startIsPending}
                                        className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {startIsPending ? 'Processing...' : 'Checkout'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default CartComponent;
