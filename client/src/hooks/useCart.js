import { useContext } from "react";

import { CartContext } from "../context/CartContext";

/* =========================================
   USE CART HOOK
========================================= */

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
};

export default useCart;