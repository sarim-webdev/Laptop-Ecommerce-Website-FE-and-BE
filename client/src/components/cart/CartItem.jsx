import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  Package,
} from "lucide-react";

import useCart from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";

const CartItem = ({ item }) => {
  const {
    updateCartItem,
    removeFromCart,
    loading,
  } = useCart();

  const [updating, setUpdating] = useState(false);

  /* =========================================
     PRODUCT DATA
  ========================================= */

  const product = item?.product || item;

  const productId =
    product?._id ||
    item?.productId;

  const name =
    product?.name ||
    "Unknown Product";

  const price = Number(
    product?.price ??
      item?.price ??
      0
  );

  const quantity = Number(
    item?.quantity || 1
  );

  const stock = Number(
    product?.stock ?? 99
  );

  /* =========================================
     PRODUCT IMAGE
  ========================================= */

  const image =
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    product?.image ||
    "/images/product-placeholder.jpg";

  /* =========================================
     SUBTOTAL
  ========================================= */

  const subtotal = price * quantity;

  /* =========================================
     LOADING
  ========================================= */

  const isUpdating =
    updating || loading;

  /* =========================================
     UPDATE QUANTITY
  ========================================= */

  const handleQuantityChange = async (
    newQuantity
  ) => {
    if (
      isUpdating ||
      newQuantity < 1 ||
      newQuantity > stock ||
      !productId
    ) {
      return;
    }

    try {
      setUpdating(true);

      await updateCartItem(
        productId,
        {
          quantity: newQuantity,
        }
      );
    } catch (error) {
      console.error(
        "Failed to update cart item:",
        error
      );
    } finally {
      setUpdating(false);
    }
  };

  /* =========================================
     REMOVE ITEM
  ========================================= */

  const handleRemove = async () => {
    if (
      isUpdating ||
      !productId
    ) {
      return;
    }

    try {
      setUpdating(true);

      await removeFromCart(productId);
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error
      );
    } finally {
      setUpdating(false);
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-700/60
        bg-gradient-to-br
        from-[#111c2d]
        via-[#0b1422]
        to-[#070d17]
        p-4
        shadow-[0_15px_45px_rgba(0,0,0,0.25)]
        transition-all
        duration-300
        hover:border-cyan-400/30
        hover:shadow-[0_15px_50px_rgba(34,211,238,0.08)]
        sm:p-5
      "
    >

      {/* =====================================
          BACKGROUND GLOW
      ===================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-cyan-500/[0.06]
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-cyan-500/[0.10]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-20
          h-40
          w-40
          rounded-full
          bg-blue-600/[0.05]
          blur-3xl
        "
      />

      {/* =====================================
          TOP CYAN ACCENT
      ===================================== */}

      <div
        className="
          absolute
          left-0
          top-0
          h-[2px]
          w-full
          origin-left
          scale-x-0
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-transparent
          transition-transform
          duration-500
          group-hover:scale-x-100
        "
      />

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-5
          sm:flex-row
        "
      >

        {/* ===================================
            PRODUCT IMAGE
        =================================== */}

        <Link
          to={`/products/${productId}`}
          className="
            relative
            flex
            h-32
            w-full
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-slate-700/60
            bg-gradient-to-br
            from-[#162438]
            to-[#080f1a]
            sm:h-36
            sm:w-36
          "
        >

          {/* Image Glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-24
              w-24
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-cyan-400/[0.10]
              blur-3xl
              transition-all
              duration-500
              group-hover:bg-cyan-400/[0.16]
            "
          />

          {/* Image */}

          <img
            src={image}
            alt={name}
            className="
              relative
              z-10
              h-full
              w-full
              object-contain
              p-4
              transition-transform
              duration-500
              group-hover:scale-105
            "
            onError={(event) => {
              event.currentTarget.src =
                "/images/product-placeholder.jpg";
            }}
          />

        </Link>

        {/* ===================================
            PRODUCT CONTENT
        =================================== */}

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
          "
        >

          {/* =================================
              PRODUCT NAME + PRICE
          ================================= */}

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >

            {/* Product Information */}

            <div className="min-w-0">

              <Link
                to={`/products/${productId}`}
                className="
                  line-clamp-2
                  text-base
                  font-bold
                  leading-6
                  text-white
                  transition-colors
                  duration-300
                  hover:text-cyan-400
                "
              >
                {name}
              </Link>

              {/* Brand */}

              {product?.brand && (
                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-slate-500
                  "
                >
                  {product.brand}
                </p>
              )}

              {/* Stock */}

              <div className="mt-3">

                {stock <= 0 ? (

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-red-400/20
                      bg-red-500/10
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-red-400
                    "
                  >
                    <Package size={11} />
                    Out of stock
                  </span>

                ) : stock <= 5 ? (

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-orange-400/20
                      bg-orange-500/10
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-orange-400
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-orange-400
                      "
                    />

                    Only {stock} left
                  </span>

                ) : (

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-emerald-400/20
                      bg-emerald-500/10
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-emerald-400
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-emerald-400
                      "
                    />

                    In stock
                  </span>

                )}

              </div>

            </div>

            {/* =================================
                PRICE
            ================================= */}

            <div
              className="
                shrink-0
                sm:text-right
              "
            >

              <p
                className="
                  text-lg
                  font-extrabold
                  text-white
                "
              >
                {formatPrice(price)}
              </p>

              {quantity > 1 && (
                <p
                  className="
                    mt-1
                    text-[11px]
                    text-slate-500
                  "
                >
                  {formatPrice(price)} ×{" "}
                  {quantity}
                </p>
              )}

            </div>

          </div>

          {/* =================================
              BOTTOM SECTION
          ================================= */}

          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              justify-between
              gap-4
              border-t
              border-slate-700/50
              pt-4
            "
          >

            {/* =================================
                QUANTITY
            ================================= */}

            <div>

              <p
                className="
                  mb-2
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                "
              >
                Quantity
              </p>

              <div
                className="
                  flex
                  items-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-700
                  bg-[#080f1a]
                  shadow-inner
                "
              >

                {/* Minus */}

                <button
                  type="button"
                  disabled={
                    isUpdating ||
                    quantity <= 1
                  }
                  onClick={() =>
                    handleQuantityChange(
                      quantity - 1
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    text-slate-400
                    transition-all
                    hover:bg-cyan-400/10
                    hover:text-cyan-400
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>

                {/* Quantity */}

                <div
                  className="
                    flex
                    h-9
                    min-w-10
                    items-center
                    justify-center
                    border-x
                    border-slate-700
                    px-2
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {isUpdating
                    ? "..."
                    : quantity}
                </div>

                {/* Plus */}

                <button
                  type="button"
                  disabled={
                    isUpdating ||
                    quantity >= stock ||
                    stock <= 0
                  }
                  onClick={() =>
                    handleQuantityChange(
                      quantity + 1
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    text-slate-400
                    transition-all
                    hover:bg-cyan-400/10
                    hover:text-cyan-400
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>

              </div>

            </div>

            {/* =================================
                SUBTOTAL + REMOVE
            ================================= */}

            <div
              className="
                flex
                items-center
                gap-5
              "
            >

              {/* Subtotal */}

              <div className="text-right">

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-500
                  "
                >
                  Subtotal
                </p>

                <p
                  className="
                    mt-1
                    text-base
                    font-extrabold
                    text-cyan-400
                  "
                >
                  {formatPrice(subtotal)}
                </p>

              </div>

              {/* Remove */}

              <button
                type="button"
                disabled={isUpdating}
                onClick={handleRemove}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-red-400/20
                  bg-red-500/10
                  text-red-400
                  transition-all
                  duration-300
                  hover:border-red-400/40
                  hover:bg-red-500/15
                  hover:text-red-300
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label={`Remove ${name} from cart`}
              >
                <Trash2
                  size={15}
                  strokeWidth={2}
                />
              </button>

            </div>

          </div>

        </div>

      </div>

    </article>
  );
};

export default CartItem;
