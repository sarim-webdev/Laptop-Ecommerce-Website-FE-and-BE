import { Link } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  ShoppingBag,
  Truck,
} from "lucide-react";

import useCart from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";

const CartSummary = ({
  showCheckout = true,
}) => {
  const {
    cartItems,
    cartCount,
    cartTotal,
  } = useCart();

  /* =========================================
     SUMMARY CALCULATIONS
  ========================================= */

  const subtotal = Number(cartTotal || 0);

  // Free shipping above Rs. 100,000
  const shipping =
    subtotal >= 100000 ? 0 : 1500;

  const tax = subtotal * 0.05;

  const total =
    subtotal + shipping + tax;

  const remainingForFreeShipping =
    Math.max(0, 100000 - subtotal);

  /* =========================================
     EMPTY CART
  ========================================= */

  if (!cartItems.length) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#0b111b]
          p-6
          shadow-2xl
          shadow-black/20
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-400/10
              bg-cyan-400/[0.08]
              text-cyan-400
            "
          >
            <ShoppingBag size={18} />
          </div>

          <h2 className="text-lg font-black text-white">
            Order Summary
          </h2>

        </div>

        <div
          className="
            mt-6
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.025]
            p-5
            text-center
          "
        >
          <p className="text-sm text-gray-500">
            Your cart is currently empty.
          </p>

          <Link
            to="/products"
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-cyan-400
              transition
              hover:text-cyan-300
            "
          >
            Continue Shopping
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        sticky
        top-24
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.08]
        bg-[#0b111b]
        shadow-2xl
        shadow-black/20
      "
    >

      {/* =====================================
          TOP ACCENT
      ===================================== */}

      <div
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-cyan-400
          to-transparent
          opacity-70
        "
      />

      <div className="p-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/[0.07]
            pb-5
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-cyan-400/10
                bg-cyan-400/[0.08]
                text-cyan-400
              "
            >
              <ShoppingBag size={18} />
            </div>

            <div>

              <h2 className="text-lg font-black text-white">
                Order Summary
              </h2>

              <p className="mt-0.5 text-[11px] text-gray-600">
                Review your order
              </p>

            </div>

          </div>

          {/* Item Count */}

          <span
            className="
              rounded-full
              border
              border-cyan-400/10
              bg-cyan-400/[0.08]
              px-3
              py-1
              text-xs
              font-bold
              text-cyan-400
            "
          >
            {cartCount}{" "}
            {cartCount === 1
              ? "item"
              : "items"}
          </span>

        </div>

        {/* =====================================
            PRICE DETAILS
        ===================================== */}

        <div
          className="
            space-y-4
            border-b
            border-white/[0.07]
            py-5
          "
        >

          {/* Subtotal */}

          <div className="flex items-center justify-between text-sm">

            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-bold text-gray-200">
              {formatPrice(subtotal)}
            </span>

          </div>

          {/* Shipping */}

          <div className="flex items-center justify-between text-sm">

            <div className="flex items-center gap-2">

              <Truck
                size={14}
                className="text-gray-600"
              />

              <span className="text-gray-500">
                Shipping
              </span>

            </div>

            <span
              className={
                shipping === 0
                  ? "font-bold text-emerald-400"
                  : "font-bold text-gray-200"
              }
            >
              {shipping === 0
                ? "FREE"
                : formatPrice(shipping)}
            </span>

          </div>

          {/* Tax */}

          <div className="flex items-center justify-between text-sm">

            <span className="text-gray-500">
              Estimated Tax
            </span>

            <span className="font-bold text-gray-200">
              {formatPrice(tax)}
            </span>

          </div>

        </div>

        {/* =====================================
            TOTAL
        ===================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            py-5
          "
        >

          <div>

            <p className="text-base font-black text-white">
              Total
            </p>

            <p className="mt-1 text-[11px] text-gray-600">
              Including estimated tax
            </p>

          </div>

          <p
            className="
              text-2xl
              font-black
              tracking-tight
              text-cyan-400
            "
          >
            {formatPrice(total)}
          </p>

        </div>

        {/* =====================================
            CHECKOUT BUTTON
        ===================================== */}

        {showCheckout && (
          <Link
            to="/checkout"
            className="
              group
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-cyan-400/20
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              px-5
              py-3.5
              text-sm
              font-black
              text-white
              shadow-lg
              shadow-cyan-500/10
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:from-cyan-400
              hover:to-blue-500
              hover:shadow-cyan-500/20
              active:translate-y-0
            "
          >
            Proceed to Checkout

            <ArrowRight
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

          </Link>
        )}

        {/* =====================================
            CONTINUE SHOPPING
        ===================================== */}

        <Link
          to="/products"
          className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.09]
            bg-white/[0.025]
            px-5
            py-3.5
            text-sm
            font-bold
            text-gray-400
            transition-all
            duration-300
            hover:border-cyan-400/20
            hover:bg-cyan-400/[0.05]
            hover:text-cyan-400
          "
        >
          Continue Shopping
        </Link>

        {/* =====================================
            FREE SHIPPING MESSAGE
        ===================================== */}

        {shipping > 0 && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-cyan-400/[0.08]
              bg-cyan-400/[0.04]
              p-4
            "
          >

            <div className="flex items-start gap-3">

              <Truck
                size={16}
                className="
                  mt-0.5
                  shrink-0
                  text-cyan-400
                "
              />

              <p
                className="
                  text-xs
                  leading-5
                  text-gray-500
                "
              >
                Add{" "}
                <span className="font-black text-cyan-400">
                  {formatPrice(
                    remainingForFreeShipping
                  )}
                </span>{" "}
                more to qualify for{" "}
                <span className="font-bold text-gray-300">
                  FREE shipping
                </span>
                .
              </p>

            </div>

          </div>
        )}

        {/* =====================================
            SECURE CHECKOUT
        ===================================== */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            border-t
            border-white/[0.05]
            pt-5
            text-[11px]
            font-medium
            text-gray-600
          "
        >

          <Lock
            size={13}
            className="text-emerald-500"
          />

          <span>
            Secure & encrypted checkout
          </span>

        </div>

      </div>

    </div>
  );
};

export default CartSummary;