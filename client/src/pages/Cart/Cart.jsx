import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import useCart from "../../hooks/useCart";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import Loader from "../../components/common/Loader";

/* =========================================
   CART PAGE
========================================= */

const Cart = () => {
  const {
    cartItems,
    cartCount,
    loading,
    error,
    getCart,
  } = useCart();

  /* =========================================
     LOADING
  ========================================= */

  if (loading && cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#05080d] text-white">

        {/* Background Glow */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          <div
            className="
              absolute
              left-1/2
              top-20
              h-72
              w-72
              -translate-x-1/2
              rounded-full
              bg-cyan-500/[0.06]
              blur-3xl
            "
          />

        </div>

        <div className="relative flex min-h-[75vh] items-center justify-center">
          <Loader />
        </div>

      </main>
    );
  }

  /* =========================================
     EMPTY CART
  ========================================= */

  if (!cartItems.length) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05080d] text-white">

        {/* Background Effects */}

        <div className="pointer-events-none absolute inset-0">

          <div
            className="
              absolute
              left-1/2
              top-20
              h-80
              w-80
              -translate-x-1/2
              rounded-full
              bg-cyan-500/[0.06]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              bottom-0
              right-0
              h-72
              w-72
              rounded-full
              bg-blue-600/[0.05]
              blur-3xl
            "
          />

        </div>

        <section
          className="
            relative
            mx-auto
            flex
            min-h-[75vh]
            max-w-7xl
            items-center
            justify-center
            px-4
            py-16
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              w-full
              max-w-xl
              rounded-3xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              p-8
              text-center
              shadow-2xl
              shadow-black/30
              backdrop-blur-xl
              sm:p-12
            "
          >

            {/* Top Accent */}

            <div
              className="
                mx-auto
                mb-8
                h-px
                w-24
                bg-gradient-to-r
                from-transparent
                via-cyan-400
                to-transparent
              "
            />

            {/* Cart Icon */}

            <div
              className="
                mx-auto
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-3xl
                border
                border-cyan-400/10
                bg-cyan-400/[0.06]
                text-cyan-400
                shadow-lg
                shadow-cyan-500/[0.05]
              "
            >
              <ShoppingBag size={40} strokeWidth={1.5} />
            </div>

            {/* Heading */}

            <p
              className="
                mt-8
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-cyan-400
              "
            >
              NEXORA
            </p>

            <h1
              className="
                mt-3
                text-2xl
                font-black
                tracking-tight
                text-white
                sm:text-3xl
              "
            >
              Your Cart is Empty
            </h1>

            <p
              className="
                mx-auto
                mt-4
                max-w-md
                text-sm
                leading-6
                text-gray-500
                sm:text-base
              "
            >
              You haven't added any laptops to your cart yet.
              Explore our collection and find the perfect laptop
              for you.
            </p>

            {/* Explore Button */}

            <Link
              to="/products"
              className="
                group
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-cyan-400/20
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                px-6
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
              "
            >
              Explore Products

              <ArrowRight
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

          </div>

        </section>

      </main>
    );
  }

  /* =========================================
     CART PAGE
  ========================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080d] text-white">

      {/* =====================================
          BACKGROUND EFFECTS
      ===================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div
          className="
            absolute
            left-1/3
            top-0
            h-96
            w-96
            rounded-full
            bg-cyan-500/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-0
            top-1/3
            h-96
            w-96
            rounded-full
            bg-blue-600/[0.035]
            blur-3xl
          "
        />

      </div>

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <section
        className="
          relative
          border-b
          border-white/[0.07]
          bg-[#080d14]/80
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            py-10
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >

            {/* Title */}

            <div>

              <div className="flex items-center gap-2">

                <span
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-cyan-400
                  "
                >
                  NEXORA
                </span>

                <ChevronRight
                  size={13}
                  className="text-gray-700"
                />

                <span
                  className="
                    text-xs
                    font-medium
                    text-gray-600
                  "
                >
                  Cart
                </span>

              </div>

              <h1
                className="
                  mt-3
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                "
              >
                Shopping Cart
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  text-gray-500
                  sm:text-base
                "
              >
                Review your selected laptops before checkout.
              </p>

            </div>

            {/* Item Count */}

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/10
                bg-cyan-400/[0.06]
                px-4
                py-2
                text-sm
                font-bold
                text-cyan-400
              "
            >

              <ShoppingBag size={15} />

              {cartCount}{" "}
              {cartCount === 1
                ? "item"
                : "items"}

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          CART CONTENT
      ========================================= */}

      <section
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          py-10
          sm:px-6
          lg:px-8
        "
      >

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div
            className="
              mb-6
              flex
              flex-col
              gap-3
              rounded-2xl
              border
              border-red-400/10
              bg-red-500/[0.06]
              px-5
              py-4
              text-sm
              text-red-400
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={getCart}
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-lg
                border
                border-red-400/10
                bg-red-500/10
                px-4
                py-2
                text-xs
                font-bold
                text-red-400
                transition
                hover:bg-red-500/15
              "
            >
              <RefreshCw size={13} />
              Try Again
            </button>

          </div>
        )}

        {/* =====================================
            GRID
        ===================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-3
          "
        >

          {/* ===================================
              CART ITEMS
          =================================== */}

          <div className="lg:col-span-2">

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.08]
                bg-[#080d14]
                shadow-2xl
                shadow-black/20
              "
            >

              {/* Items Header */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-b
                  border-white/[0.07]
                  px-5
                  py-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:px-6
                "
              >

                <div>

                  <div className="flex items-center gap-2">

                    <ShoppingBag
                      size={17}
                      className="text-cyan-400"
                    />

                    <h2
                      className="
                        text-lg
                        font-black
                        text-white
                      "
                    >
                      Cart Items
                    </h2>

                  </div>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-600
                    "
                  >
                    {cartCount}{" "}
                    {cartCount === 1
                      ? "product"
                      : "products"}{" "}
                    in your cart
                  </p>

                </div>

                <Link
                  to="/products"
                  className="
                    group
                    flex
                    w-fit
                    items-center
                    gap-1.5
                    text-sm
                    font-bold
                    text-cyan-400
                    transition
                    hover:text-cyan-300
                  "
                >
                  Continue Shopping

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>

              </div>

              {/* Items */}

              <div className="divide-y divide-white/[0.06]">

                {cartItems.map((item, index) => {

                  const productId =
                    item.product?._id ||
                    item.productId ||
                    item._id;

                  return (
                    <CartItem
                      key={
                        productId ||
                        item._id ||
                        `cart-item-${index}`
                      }
                      item={item}
                    />
                  );
                })}

              </div>

            </div>

          </div>

          {/* ===================================
              CART SUMMARY
          =================================== */}

          <div className="lg:col-span-1">

            <CartSummary />

          </div>

        </div>

      </section>

      {/* =========================================
          TRUST SECTION
      ========================================= */}

      <section
        className="
          relative
          border-t
          border-white/[0.07]
          bg-[#080d14]/80
        "
      >

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            gap-4
            px-4
            py-10
            sm:grid-cols-3
            sm:px-6
            lg:px-8
          "
        >

          {/* Secure Checkout */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              p-5
              transition
              hover:border-cyan-400/10
              hover:bg-white/[0.03]
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/10
                  bg-cyan-400/[0.06]
                  text-cyan-400
                "
              >
                <ShieldCheck size={20} />
              </div>

              <div>

                <h3
                  className="
                    text-sm
                    font-black
                    text-white
                  "
                >
                  Secure Checkout
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-gray-600
                  "
                >
                  Your payment information is protected.
                </p>

              </div>

            </div>

          </div>

          {/* Fast Delivery */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              p-5
              transition
              hover:border-cyan-400/10
              hover:bg-white/[0.03]
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/10
                  bg-cyan-400/[0.06]
                  text-cyan-400
                "
              >
                <Truck size={20} />
              </div>

              <div>

                <h3
                  className="
                    text-sm
                    font-black
                    text-white
                  "
                >
                  Fast Delivery
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-gray-600
                  "
                >
                  Reliable delivery right to your doorstep.
                </p>

              </div>

            </div>

          </div>

          {/* Warranty */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              p-5
              transition
              hover:border-cyan-400/10
              hover:bg-white/[0.03]
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/10
                  bg-cyan-400/[0.06]
                  text-cyan-400
                "
              >
                <CheckCircle2 size={20} />
              </div>

              <div>

                <h3
                  className="
                    text-sm
                    font-black
                    text-white
                  "
                >
                  1-Year Warranty
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-gray-600
                  "
                >
                  Shop with confidence and peace of mind.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Cart;