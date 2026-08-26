import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import cartService from "../services/cartService.js";
import useAuth from "../hooks/useAuth.js";

/* =========================================
   CART CONTEXT
========================================= */

export const CartContext = createContext(null);

/* =========================================
   CART PROVIDER
========================================= */

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================================
     NORMALIZE CART RESPONSE
  ========================================= */

  const extractCart = useCallback((response) => {
    return (
      response?.data?.cart ||
      response?.data ||
      response?.cart ||
      null
    );
  }, []);

  /* =========================================
     CART ITEMS
  ========================================= */

  const cartItems = useMemo(() => {
    if (!cart) {
      return [];
    }

    return cart.items || cart.cartItems || [];
  }, [cart]);

  /* =========================================
     CART COUNT
  ========================================= */

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.quantity || 0);
    }, 0);
  }, [cartItems]);

  /* =========================================
     CART TOTAL
  ========================================= */

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(
        item.price ??
          item.product?.price ??
          0
      );

      const quantity = Number(item.quantity || 0);

      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  /* =========================================
     CLEAR ERROR
  ========================================= */

  const clearCartError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================================
     GET CART
  ========================================= */

  const getCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await cartService.getCart();

      const cartData = extractCart(response);

      setCart(cartData);

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to load cart.";

      setError(message);

      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, extractCart]);

  /* =========================================
     ADD TO CART
  ========================================= */

  const addToCart = useCallback(
  async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error(
        "Please login to add products to cart."
      );
    }

    try {
      setLoading(true);
      setError(null);

      await cartService.addToCart({
        productId,
        quantity,
      });

      // Always fetch the latest cart
      const response = await cartService.getCart();

      const latestCart = extractCart(response);

      setCart(latestCart);

      return latestCart;
    } catch (error) {
  console.log("========== ADD TO CART ERROR ==========");
  console.log("Status:", error?.response?.status);
  console.log("Response data:", error?.response?.data);
  console.log("Response:", error?.response);
  console.log("Request data:", {
    productId,
    quantity,
  });
  console.log("Error message:", error?.message);
  console.log("========================================");

  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to add product to cart.";

  setError(message);

  throw error;
}finally {
      setLoading(false);
    }
  },
  [
    isAuthenticated,
    extractCart,
  ]
);

  /* =========================================
     UPDATE CART ITEM
  ========================================= */

  const updateCartItem = useCallback(
    async (productId, quantity) => {
      if (!isAuthenticated) {
        throw new Error(
          "Please login to update your cart."
        );
      }

      if (quantity < 1) {
        throw new Error(
          "Quantity must be at least 1."
        );
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await cartService.updateCartItem(
            productId,
            { quantity }
          );

        const updatedCart = extractCart(response);

        if (updatedCart) {
          setCart(updatedCart);
        } else {
          await getCart();
        }

        return response;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update cart.";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, extractCart, getCart]
  );

  /* =========================================
     REMOVE FROM CART
  ========================================= */

  const removeFromCart = useCallback(
    async (productId) => {
      if (!isAuthenticated) {
        throw new Error(
          "Please login to modify your cart."
        );
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await cartService.removeFromCart(
            productId
          );

        const updatedCart = extractCart(response);

        if (updatedCart) {
          setCart(updatedCart);
        } else {
          await getCart();
        }

        return response;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to remove product from cart.";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, extractCart, getCart]
  );

  /* =========================================
     CLEAR CART
  ========================================= */

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error(
        "Please login to clear your cart."
      );
    }

    try {
      setLoading(true);
      setError(null);

      const response = await cartService.clearCart();

      const updatedCart = extractCart(response);

      setCart(updatedCart);

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to clear cart.";

      setError(message);

      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, extractCart]);

  /* =========================================
     REFRESH CART
  ========================================= */

  const refreshCart = useCallback(async () => {
    return getCart();
  }, [getCart]);

  /* =========================================
     INITIAL CART LOAD
  ========================================= */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setCart(null);
      setError(null);
      setLoading(false);
      return;
    }

    getCart().catch(() => {});
  }, [authLoading, isAuthenticated, getCart]);

  /* =========================================
     CONTEXT VALUE
  ========================================= */

  const value = useMemo(
    () => ({
      /* Cart data */
      cart,
      cartItems,

      /* Calculations */
      cartCount,
      cartTotal,

      /* States */
      loading,
      error,

      /* Actions */
      getCart,
      refreshCart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      clearCartError,
    }),
    [
      cart,
      cartItems,
      cartCount,
      cartTotal,
      loading,
      error,
      getCart,
      refreshCart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      clearCartError,
    ]
  );

  /* =========================================
     PROVIDER
  ========================================= */

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;