import { createContext, useState, useEffect } from "react";
import api from "../utils/api";

// Create the context
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  // Generate session ID for guest users
  const getSessionId = () => {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId =
        "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  };

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart", {
        headers: {
          "Session-Id": getSessionId(),
        },
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    try {
      const response = await api.post(
        "/cart/add",
        { itemId, quantity },
        {
          headers: {
            "Session-Id": getSessionId(),
          },
        }
      );
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add to cart",
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.put(
        "/cart/update",
        { itemId, quantity },
        {
          headers: {
            "Session-Id": getSessionId(),
          },
        }
      );
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update cart",
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`, {
        headers: {
          "Session-Id": getSessionId(),
        },
      });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove from cart",
      };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear", {
        headers: {
          "Session-Id": getSessionId(),
        },
      });
      setCart({ items: [], totalAmount: 0 });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to clear cart",
      };
    }
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
export { CartContext };
