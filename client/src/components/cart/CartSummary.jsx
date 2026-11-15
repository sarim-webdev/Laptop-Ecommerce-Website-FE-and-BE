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
          border-[#263449]
          bg-[#0B1220]
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
              border-sky-400/20
              bg-sky-400/10
              text-sky-400
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
            border-[#263449]
            bg-[#111C2E]
            p-5
            text-center
          "
        >
          <p className="text-sm text-slate-400">
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
              text-sky-400
              transition
              hover:text-sky-300
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
        border-[#263449]
        bg-[#0B1220]
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
          via-sky-400
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
            border-[#263449]
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
                border-sky-400/20
                bg-sky-400/10
                text-sky-400
              "
            >
              <ShoppingBag size={18} />
            </div>

            <div>

              <h2 className="text-lg font-black text-white">
                Order Summary
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Review your order
              </p>

            </div>

          </div>

          {/* Item Count */}

          <span
            className="
              rounded-full
              border
              border-sky-400/20
              bg-sky-400/10
              px-3
              py-1
              text-xs
              font-bold
              text-sky-400
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
            border-[#263449]
            py-5
          "
        >

          {/* Subtotal */}

          <div className="flex items-center justify-between text-sm">

            <span className="text-slate-400">
              Subtotal
            </span>

            <span className="font-bold text-slate-200">
              {formatPrice(subtotal)}
            </span>

          </div>

          {/* Shipping */}

          <div className="flex items-center justify-between text-sm">

            <div className="flex items-center gap-2">

              <Truck
                size={14}
                className="text-slate-400"
              />

              <span className="text-slate-400">
                Shipping
              </span>

            </div>

            <span
              className={
                shipping === 0
                  ? "font-bold text-emerald-400"
                  : "font-bold text-slate-200"
              }
            >
              {shipping === 0
                ? "FREE"
                : formatPrice(shipping)}
            </span>

          </div>

          {/* Tax */}

          <div className="flex items-center justify-between text-sm">

            <span className="text-slate-400">
              Estimated Tax
            </span>

            <span className="font-bold text-slate-200">
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

            <p className="mt-1 text-[11px] text-slate-400">
              Including estimated tax
            </p>

          </div>

          <p
            className="
              text-2xl
              font-black
              tracking-tight
              text-sky-400
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
              border-sky-400/20
              bg-gradient-to-r
              from-sky-400
              to-blue-600
              px-5
              py-3.5
              text-sm
              font-black
              text-[#0B1220]
              shadow-lg
              shadow-sky-500/10
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:from-sky-300
              hover:to-blue-400
              hover:shadow-sky-500/20
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
            border-[#263449]
            bg-[#111C2E]
            px-5
            py-3.5
            text-sm
            font-bold
            text-slate-300
            transition-all
            duration-300
            hover:border-sky-400/20
            hover:bg-[#15243A]
            hover:text-sky-400
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
              border-sky-400/20
              bg-sky-400/10
              p-4
            "
          >

            <div className="flex items-start gap-3">

              <Truck
                size={16}
                className="
                  mt-0.5
                  shrink-0
                  text-sky-400
                "
              />

              <p
                className="
                  text-xs
                  leading-5
                  text-slate-400
                "
              >
                Add{" "}
                <span className="font-black text-sky-400">
                  {formatPrice(
                    remainingForFreeShipping
                  )}
                </span>{" "}
                more to qualify for{" "}
                <span className="font-bold text-slate-300">
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
            border-[#263449]
            pt-5
            text-[11px]
            font-medium
            text-slate-400
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