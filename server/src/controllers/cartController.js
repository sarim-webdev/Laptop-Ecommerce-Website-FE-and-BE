import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/* =========================================
   GET CART
   GET /api/cart
========================================= */

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    /* =========================================
       FIND USER CART
    ========================================= */

    let cart = await Cart.findOne({
      user: userId,
    }).populate({
      path: "items.product",
      match: { isActive: true },
      select: "name price images brand stock category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    /* =========================================
       CREATE EMPTY CART IF NOT EXISTS
    ========================================= */

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0,
      });

      return successResponse(res, 200, "Cart retrieved successfully.", {
        cart,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });
    }

    /* =========================================
       REMOVE INVALID PRODUCTS
       Products may have been deleted.
    ========================================= */

    const validItems = cart.items.filter((item) => item.product);

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;

      await cart.save();
    }

    /* =========================================
       CALCULATE TOTALS
    ========================================= */

    let totalItems = 0;
    let totalAmount = 0;

    cart.items.forEach((item) => {
      if (item.product) {
        totalItems += item.quantity;

        totalAmount += item.product.price * item.quantity;

        // Keep stored cart price synchronized
        item.price = item.product.price;
      }
    });

    cart.totalAmount = totalAmount;

    await cart.save();

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(res, 200, "Cart retrieved successfully.", {
      cart,
      items: cart.items,
      totalItems,
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   ADD TO CART
   POST /api/cart

   Body:
   {
     "productId": "...",
     "quantity": 1
   }
========================================= */

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { productId, quantity = 1 } = req.body;

    /* =========================================
       VALIDATE PRODUCT ID
    ========================================= */

    if (!productId) {
      return errorResponse(res, 400, "Product ID is required.");
    }

    /* =========================================
       VALIDATE QUANTITY
    ========================================= */

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return errorResponse(res, 400, "Quantity must be a positive integer.");
    }

    /* =========================================
       FIND PRODUCT
    ========================================= */

    if (!mongoose.isValidObjectId(productId)) {
      return errorResponse(res, 400, "Invalid product ID.");
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }

    /* =========================================
       CHECK PRODUCT STOCK
    ========================================= */

    if (product.stock <= 0) {
      return errorResponse(res, 400, "This product is currently out of stock.");
    }

    /* =========================================
       FIND OR CREATE CART
    ========================================= */

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );

    /* =========================================
       CHECK EXISTING PRODUCT
    ========================================= */

    if (existingItem) {
      const newQuantity = existingItem.quantity + parsedQuantity;

      if (newQuantity > product.stock) {
        return errorResponse(
          res,
          400,
          `Only ${product.stock} units are available in stock.`,
        );
      }

      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
    } else {
      /* =========================================
         NEW CART ITEM
      ========================================= */

      if (parsedQuantity > product.stock) {
        return errorResponse(
          res,
          400,
          `Only ${product.stock} units are available in stock.`,
        );
      }

      cart.items.push({
        product: product._id,
        quantity: parsedQuantity,
        price: product.price,
      });
    }

    /* =========================================
       CALCULATE TOTAL
    ========================================= */

    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    await cart.save();

    /* =========================================
       POPULATE CART
    ========================================= */

    await cart.populate({
      path: "items.product",
      select: "name price images brand stock category",
    });

    return successResponse(
      res,
      200,
      existingItem
        ? "Product quantity increased successfully."
        : "Product added to cart successfully.",
      {
        cart,
        totalItems: cart.items.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        totalAmount: cart.totalAmount,
      },
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPDATE CART ITEM
   PUT /api/cart/:productId

   Body:
   {
     "quantity": 3
   }
========================================= */

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { productId } = req.params;

    const { quantity } = req.body;

    /* =========================================
       VALIDATE QUANTITY
    ========================================= */

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return errorResponse(res, 400, "Quantity must be a positive integer.");
    }

    /* =========================================
       FIND PRODUCT
    ========================================= */

    if (!mongoose.isValidObjectId(productId)) {
      return errorResponse(res, 400, "Invalid product ID.");
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }

    /* =========================================
       CHECK STOCK
    ========================================= */

    if (parsedQuantity > product.stock) {
      return errorResponse(
        res,
        400,
        `Only ${product.stock} units are available in stock.`,
      );
    }

    /* =========================================
       FIND CART
    ========================================= */

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return errorResponse(res, 404, "Cart not found.");
    }

    /* =========================================
       FIND CART ITEM
    ========================================= */

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );

    if (!cartItem) {
      return errorResponse(res, 404, "Product is not in your cart.");
    }

    /* =========================================
       UPDATE QUANTITY
    ========================================= */

    cartItem.quantity = parsedQuantity;

    /*
      Update price with current
      product price.
    */

    cartItem.price = product.price;

    /* =========================================
       RECALCULATE TOTAL
    ========================================= */

    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    await cart.save();

    /* =========================================
       POPULATE CART
    ========================================= */

    await cart.populate({
      path: "items.product",
      select: "name price images brand stock category",
    });

    return successResponse(res, 200, "Cart item updated successfully.", {
      cart,
      totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: cart.totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   REMOVE FROM CART
   DELETE /api/cart/:productId
========================================= */

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { productId } = req.params;

    /* =========================================
         FIND CART
      ========================================= */

    if (!mongoose.isValidObjectId(productId)) {
      return errorResponse(res, 400, "Invalid product ID.");
    }

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return errorResponse(res, 404, "Cart not found.");
    }

    /* =========================================
         FIND ITEM
      ========================================= */

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId.toString(),
    );

    if (!itemExists) {
      return errorResponse(res, 404, "Product is not in your cart.");
    }

    /* =========================================
         REMOVE ITEM
      ========================================= */

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString(),
    );

    /* =========================================
         RECALCULATE TOTAL
      ========================================= */

    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    await cart.save();

    /* =========================================
         POPULATE CART
      ========================================= */

    await cart.populate({
      path: "items.product",
      select: "name price images brand stock category",
    });

    return successResponse(
      res,
      200,
      "Product removed from cart successfully.",
      {
        cart,
        totalItems: cart.items.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        totalAmount: cart.totalAmount,
      },
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   CLEAR CART
   DELETE /api/cart
========================================= */

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    /* =========================================
       FIND CART
    ========================================= */

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return errorResponse(res, 404, "Cart not found.");
    }

    /* =========================================
       CLEAR ITEMS
    ========================================= */

    cart.items = [];

    cart.totalAmount = 0;

    await cart.save();

    return successResponse(res, 200, "Cart cleared successfully.", {
      cart,
      items: [],
      totalItems: 0,
      totalAmount: 0,
    });
  } catch (error) {
    next(error);
  }
};
