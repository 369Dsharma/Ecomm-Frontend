import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-black">Loading cart...</div>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-black mb-4">Your Cart</h1>
          <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
          <Link
            to="/"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-black">Your Cart</h1>
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 underline"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cart.items.map((cartItem) => (
              <div
                key={cartItem.item._id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Item Image */}
                <div className="sm:w-32 sm:h-32 flex-shrink-0">
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {cartItem.item.name}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    {cartItem.item.description}
                  </p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {cartItem.item.category}
                    </span>
                    <span className="text-xl font-bold text-black">
                      ${cartItem.item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-black">
                        Quantity:
                      </label>
                      <div className="flex items-center border border-black rounded">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              cartItem.item._id,
                              cartItem.quantity - 1
                            )
                          }
                          disabled={
                            updatingItems[cartItem.item._id] ||
                            cartItem.quantity <= 1
                          }
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-l border-r border-black">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              cartItem.item._id,
                              cartItem.quantity + 1
                            )
                          }
                          disabled={updatingItems[cartItem.item._id]}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-black">
                        ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(cartItem.item._id)}
                        disabled={updatingItems[cartItem.item._id]}
                        className="text-red-600 hover:text-red-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingItems[cartItem.item._id]
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-black">
                  Items (
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                  )
                </span>
                <span className="text-black">
                  ${cart.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Shipping</span>
                <span className="text-black">Free</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-black">Total</span>
                <span className="text-black">
                  ${cart.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <button className="w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors mb-4">
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-black hover:text-gray-600 underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
