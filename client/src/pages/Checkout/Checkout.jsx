import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

import useCart from "../../hooks/useCart";
import orderService from "../../services/orderService";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/common/Loader";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    loading: cartLoading,
    clearCart,
  } = useCart();

  /* =========================================
     FORM STATE
  ========================================= */

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =========================================
     CALCULATIONS
  ========================================= */

  const subtotal = Number(cartTotal || 0);

  const shipping = subtotal >= 100000 ? 0 : 1500;

  const tax = subtotal * 0.05;

  const total = subtotal + shipping + tax;

  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =========================================
     ORDER ITEMS
  ========================================= */

  const orderItems = useMemo(() => {
    return cartItems
      .map((item) => {
        const product =
          item?.product || item;

        const productId =
          product?._id ||
          item?.productId ||
          item?._id;

        const name =
          product?.name ||
          item?.name ||
          "Unknown Product";

        const image =
          product?.images?.[0]?.url ||
          product?.images?.[0] ||
          product?.image ||
          "";

        const price = Number(
          product?.price ??
            item?.price ??
            0
        );

        const quantity = Number(
          item?.quantity || 1
        );

        return {
          product: productId,
          name,
          image,
          price,
          quantity,
          subtotal: price * quantity,
        };
      })
      .filter((item) => item.product);
  }, [cartItems]);

  /* =========================================
     VALIDATION
  ========================================= */

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!formData.address.trim()) {
      return "Please enter your delivery address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!formData.country.trim()) {
      return "Please enter your country.";
    }

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return "Please select a valid payment method.";
    }

    if (!orderItems.length) {
      return "Your cart is empty.";
    }

    return null;
  };

  /* =========================================
     PLACE ORDER
  ========================================= */

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        orderItems,

        shippingAddress: {
          fullName:
            formData.fullName.trim(),

          phone:
            formData.phone.trim(),

          address:
            formData.address.trim(),

          city:
            formData.city.trim(),

          state:
            formData.state.trim(),

          postalCode:
            formData.postalCode.trim(),

          country:
            formData.country.trim(),
        },

        paymentMethod,
      };

      console.log(
        "========== ORDER DATA =========="
      );

      console.log(orderData);

      console.log(
        "================================"
      );

      const response =
        await orderService.createOrder(
          orderData
        );

      console.log(
        "========== ORDER RESPONSE =========="
      );

      console.log(response);

      console.log(
        "===================================="
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to create order."
        );
      }

      await clearCart();

      setSuccess(
        "Your order has been placed successfully."
      );

      /*
       * Backend should return:
       *
       * {
       *   success: true,
       *   order: {...}
       * }
       *
       * or:
       *
       * {
       *   success: true,
       *   data: {...}
       * }
       */

      const createdOrder =
        response?.order ||
        response?.data;

      const orderId =
        createdOrder?._id ||
        createdOrder?.id;

      /*
       * Give backend/cart state a moment
       * and then navigate.
       */

      if (orderId) {
        navigate(
          `/orders/${orderId}`,
          {
            replace: true,
          }
        );
      } else {
        navigate("/orders", {
          replace: true,
        });
      }
    } catch (err) {
      console.error(
        "========== CHECKOUT ERROR =========="
      );

      console.error(err);

      console.error(
        "===================================="
      );

      const backendMessage =
        err?.response?.data?.message;

      const validationErrors =
        err?.response?.data?.errors;

      if (
        Array.isArray(validationErrors) &&
        validationErrors.length > 0
      ) {
        setError(
          validationErrors
            .map(
              (item) =>
                item?.message ||
                "Invalid order data."
            )
            .join(" ")
        );
      } else {
        setError(
          backendMessage ||
            err?.message ||
            "Something went wrong while placing your order."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (cartLoading && cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#05080d]">
        <div className="flex min-h-[70vh] items-center justify-center">
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
      <main className="min-h-screen bg-[#05080d] px-4 py-16">
        <div className="mx-auto flex min-h-[65vh] max-w-lg items-center justify-center">

          <div
            className="
              w-full
              rounded-3xl
              border
              border-white/[0.08]
              bg-white/[0.035]
              p-8
              text-center
              shadow-2xl
              shadow-black/20
              backdrop-blur-xl
              sm:p-12
            "
          >

            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-2xl
                border
                border-cyan-400/10
                bg-cyan-400/[0.06]
                text-cyan-400
              "
            >
              <Package size={38} />
            </div>

            <h1
              className="
                mt-6
                text-2xl
                font-black
                text-white
                sm:text-3xl
              "
            >
              Your Cart is Empty
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                leading-6
                text-gray-500
              "
            >
              Add a laptop to your cart before
              proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-cyan-500
                px-6
                py-3.5
                text-sm
                font-black
                text-[#031018]
                shadow-lg
                shadow-cyan-500/10
                transition-all
                duration-300
                hover:bg-cyan-400
                hover:shadow-cyan-400/20
              "
            >
              Explore Products
            </Link>

          </div>
        </div>
      </main>
    );
  }

  /* =========================================
     CHECKOUT PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-[#05080d]">

      {/* =====================================
          HEADER
      ===================================== */}

      <section
        className="
          border-b
          border-white/[0.06]
          bg-[#070b11]
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            py-8
            sm:px-6
            lg:px-8
          "
        >

          <Link
            to="/cart"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-gray-500
              transition
              hover:text-cyan-400
            "
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <div className="mt-6">

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

            <h1
              className="
                mt-2
                text-3xl
                font-black
                tracking-tight
                text-white
                sm:text-4xl
              "
            >
              Checkout
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
                sm:text-base
              "
            >
              Complete your details and place
              your laptop order securely.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================
          CONTENT
      ===================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-4
          py-10
          sm:px-6
          lg:px-8
        "
      >

        {/* Error */}

        {error && (
          <div
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-400/10
              bg-red-500/[0.06]
              px-5
              py-4
              text-sm
              text-red-300
            "
          >
            <span
              className="
                mt-0.5
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-500/10
                text-xs
                font-bold
              "
            >
              !
            </span>

            <p>{error}</p>
          </div>
        )}

        {/* Success */}

        {success && (
          <div
            className="
              mb-6
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-emerald-400/10
              bg-emerald-500/[0.06]
              px-5
              py-4
              text-sm
              text-emerald-300
            "
          >
            <CheckCircle2 size={18} />

            <p>{success}</p>
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-3
          "
        >

          {/* ===================================
              LEFT SIDE
          =================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================
                SHIPPING INFORMATION
            ================================= */}

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                shadow-2xl
                shadow-black/10
                backdrop-blur-xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-white/[0.06]
                  px-5
                  py-5
                  sm:px-6
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-400/[0.08]
                    text-cyan-400
                  "
                >
                  <MapPin size={19} />
                </div>

                <div>

                  <h2
                    className="
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    Delivery Information
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-gray-600
                    "
                  >
                    Where should we deliver your order?
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                {/* Full Name */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="fullName"
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-700
                      focus:border-cyan-400/40
                      focus:bg-black/30
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

                {/* Phone */}

                <div>

                  <label
                    htmlFor="phone"
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03XX XXXXXXX"
                    autoComplete="tel"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-700
                      focus:border-cyan-400/40
                      focus:bg-black/30
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

                {/* Country */}

                <div>

                  <label
                    htmlFor="country"
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Pakistan"
                    autoComplete="country-name"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-700
                      focus:border-cyan-400/40
                      focus:bg-black/30
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

                {/* Address */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="address"
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Complete Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="House / Flat / Street / Area"
                    autoComplete="street-address"
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-700
                      focus:border-cyan-400/40
                      focus:bg-black/30
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

                {/* City */}

                <div>

                  <label
                    htmlFor="city"
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Karachi"
                    autoComplete="address-level2"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-700
                      focus:border-cyan-400/40
                      focus:bg-black/30
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

                {/* State */}

                <div>

                  <label
                    htmlFor="state"
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    State / Province
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Sindh"
                    autoComplete="address-level1"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-700
                      focus:border-cyan-400/40
                      focus:bg-black/30
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

                {/* Postal Code */}

                <div>

                  <label
                    htmlFor="postalCode"
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Postal Code
                  </label>

                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="74000"
                    autoComplete="postal-code"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-700
                      focus:border-cyan-400/40
                      focus:bg-black/30
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

              </div>

            </div>

            {/* =================================
                PAYMENT METHOD
            ================================= */}

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                shadow-2xl
                shadow-black/10
                backdrop-blur-xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-white/[0.06]
                  px-5
                  py-5
                  sm:px-6
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-400/[0.08]
                    text-cyan-400
                  "
                >
                  <CreditCard size={19} />
                </div>

                <div>

                  <h2
                    className="
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    Payment Method
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-gray-600
                    "
                  >
                    Select your preferred payment option.
                  </p>

                </div>

              </div>

              <div className="space-y-3 p-5 sm:p-6">

                {/* COD */}

                <label
                  className={`
                    flex
                    cursor-pointer
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    transition-all
                    duration-300
                    ${
                      paymentMethod === "COD"
                        ? "border-cyan-400/30 bg-cyan-400/[0.06]"
                        : "border-white/[0.07] bg-black/10 hover:border-white/[0.12]"
                    }
                  `}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                    className="h-4 w-4 accent-cyan-400"
                  />

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/[0.05]
                      text-cyan-400
                    "
                  >
                    <Truck size={19} />
                  </div>

                  <div className="flex-1">

                    <p
                      className="
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      Cash on Delivery
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-600
                      "
                    >
                      Pay when your order arrives.
                    </p>

                  </div>

                  {paymentMethod === "COD" && (
                    <CheckCircle2
                      size={18}
                      className="text-cyan-400"
                    />
                  )}

                </label>

                {/* ONLINE */}

                <label
                  className={`
                    flex
                    cursor-pointer
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    transition-all
                    duration-300
                    ${
                      paymentMethod === "ONLINE"
                        ? "border-cyan-400/30 bg-cyan-400/[0.06]"
                        : "border-white/[0.07] bg-black/10 hover:border-white/[0.12]"
                    }
                  `}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={
                      paymentMethod === "ONLINE"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                    className="h-4 w-4 accent-cyan-400"
                  />

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/[0.05]
                      text-cyan-400
                    "
                  >
                    <CreditCard size={19} />
                  </div>

                  <div className="flex-1">

                    <p
                      className="
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      Online Payment
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-600
                      "
                    >
                      Online payment integration.
                    </p>

                  </div>

                  {paymentMethod === "ONLINE" && (
                    <CheckCircle2
                      size={18}
                      className="text-cyan-400"
                    />
                  )}

                </label>

                {paymentMethod === "ONLINE" && (
                  <div
                    className="
                      rounded-xl
                      border
                      border-orange-400/10
                      bg-orange-400/[0.04]
                      px-4
                      py-3
                      text-xs
                      leading-5
                      text-orange-300
                    "
                  >
                    Online payment gateway is not
                    configured yet. You can still
                    send the order as ONLINE, but
                    payment processing needs to be
                    implemented on the backend.
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ===================================
              RIGHT SIDE — ORDER SUMMARY
          =================================== */}

          <aside className="lg:col-span-1">

            <div
              className="
                sticky
                top-24
                overflow-hidden
                rounded-3xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                shadow-2xl
                shadow-black/20
                backdrop-blur-xl
              "
            >

              {/* Summary Header */}

              <div
                className="
                  border-b
                  border-white/[0.06]
                  px-5
                  py-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <h2
                    className="
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    Order Summary
                  </h2>

                  <span
                    className="
                      rounded-full
                      border
                      border-cyan-400/10
                      bg-cyan-400/[0.06]
                      px-3
                      py-1
                      text-[10px]
                      font-black
                      uppercase
                      tracking-wider
                      text-cyan-400
                    "
                  >
                    {cartCount}{" "}
                    {cartCount === 1
                      ? "Item"
                      : "Items"}
                  </span>

                </div>

              </div>

              {/* Products */}

              <div
                className="
                  max-h-80
                  space-y-4
                  overflow-y-auto
                  border-b
                  border-white/[0.06]
                  p-5
                "
              >

                {cartItems.map(
                  (item, index) => {
                    const product =
                      item?.product || item;

                    const productId =
                      product?._id ||
                      item?.productId ||
                      item?._id;

                    const name =
                      product?.name ||
                      "Unknown Product";

                    const price =
                      Number(
                        product?.price ??
                          item?.price ??
                          0
                      );

                    const quantity =
                      Number(
                        item?.quantity || 1
                      );

                    const image =
                      product?.images?.[0]?.url ||
                      product?.images?.[0] ||
                      product?.image ||
                      "/images/product-placeholder.jpg";

                    return (
                      <div
                        key={
                          productId ||
                          index
                        }
                        className="
                          flex
                          gap-3
                        "
                      >

                        <div
  className="
    relative
    flex
    h-20
    w-28
    shrink-0
    items-center
    justify-center
    overflow-hidden
    rounded-xl
    border
    border-white/[0.06]
    bg-[#080d14]
  "
>
  <img
    src={image}
    alt={name}
    className="
      h-full
      w-full
      object-contain
    "
  />
</div>

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              line-clamp-2
                              text-xs
                              font-bold
                              leading-5
                              text-gray-300
                            "
                          >
                            {name}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-gray-600
                            "
                          >
                            {formatPrice(price)} ×{" "}
                            {quantity}
                          </p>

                        </div>

                        <p
                          className="
                            shrink-0
                            text-xs
                            font-black
                            text-white
                          "
                        >
                          {formatPrice(
                            price * quantity
                          )}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

              {/* Price Details */}

              <div
                className="
                  space-y-4
                  border-b
                  border-white/[0.06]
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span
                    className="
                      font-bold
                      text-gray-300
                    "
                  >
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span
                    className={
                      shipping === 0
                        ? "font-bold text-emerald-400"
                        : "font-bold text-gray-300"
                    }
                  >
                    {shipping === 0
                      ? "FREE"
                      : formatPrice(
                          shipping
                        )}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >
                  <span className="text-gray-600">
                    Estimated Tax
                  </span>

                  <span
                    className="
                      font-bold
                      text-gray-300
                    "
                  >
                    {formatPrice(tax)}
                  </span>
                </div>

              </div>

              {/* Total */}

              <div className="p-5">

                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <p
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-gray-600
                      "
                    >
                      Total
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-gray-700
                      "
                    >
                      Including estimated tax
                    </p>

                  </div>

                  <p
                    className="
                      text-2xl
                      font-black
                      text-cyan-400
                    "
                  >
                    {formatPrice(total)}
                  </p>

                </div>

                {/* Place Order */}

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    mt-6
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-cyan-500
                    px-5
                    py-4
                    text-sm
                    font-black
                    text-[#031018]
                    shadow-lg
                    shadow-cyan-500/10
                    transition-all
                    duration-300
                    hover:bg-cyan-400
                    hover:shadow-cyan-400/20
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {submitting ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-[#031018]/30
                          border-t-[#031018]
                        "
                      />

                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <CheckCircle2 size={17} />
                    </>
                  )}
                </button>

                {/* Secure */}

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[10px]
                    font-semibold
                    text-gray-600
                  "
                >
                  <ShieldCheck
                    size={14}
                    className="text-cyan-400"
                  />

                  <span>
                    Secure & protected checkout
                  </span>
                </div>

              </div>

            </div>

          </aside>

        </form>

      </section>

      {/* =====================================
          TRUST SECTION
      ===================================== */}

      <section
        className="
          border-t
          border-white/[0.06]
          bg-[#070b11]
        "
      >

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            gap-6
            px-4
            py-10
            sm:grid-cols-3
            sm:px-6
            lg:px-8
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
                bg-cyan-400/[0.07]
                text-cyan-400
              "
            >
              <ShieldCheck size={20} />
            </div>

            <div>

              <h3
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                Secure Checkout
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-600
                "
              >
                Your order information is protected.
              </p>

            </div>

          </div>

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
                bg-cyan-400/[0.07]
                text-cyan-400
              "
            >
              <Truck size={20} />
            </div>

            <div>

              <h3
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                Fast Delivery
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-600
                "
              >
                Reliable delivery to your doorstep.
              </p>

            </div>

          </div>

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
                bg-cyan-400/[0.07]
                text-cyan-400
              "
            >
              <Package size={20} />
            </div>

            <div>

              <h3
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                1-Year Warranty
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-600
                "
              >
                Shop with confidence.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Checkout;
