import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Clock3,
  XCircle,
  Phone,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";

import orderService from "../../services/orderService";
import Loader from "../../components/common/Loader";
import { formatPrice } from "../../utils/formatPrice";

/* =========================================
   ORDER DETAILS
========================================= */

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     FETCH ORDER
  ========================================= */

  const fetchOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response =
        await orderService.getOrderById(id);

      const orderData =
        response?.data?.order ||
        response?.data ||
        response?.order ||
        null;

      setOrder(orderData);
    } catch (err) {
      console.error(
        "Failed to load order:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load order details."
      );

      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /* =========================================
     HELPERS
  ========================================= */

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  /* =========================================
     ORDER STATUS
  ========================================= */

  const getStatusConfig = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (normalized === "delivered") {
      return {
        label: "Delivered",
        icon: CheckCircle2,
        className:
          "border-emerald-400/20 bg-emerald-500/10 text-emerald-400",
      };
    }

    if (normalized === "shipped") {
      return {
        label: "Shipped",
        icon: Truck,
        className:
          "border-blue-400/20 bg-blue-500/10 text-blue-400",
      };
    }

    if (normalized === "confirmed") {
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className:
          "border-cyan-400/20 bg-cyan-500/10 text-cyan-400",
      };
    }

    if (normalized === "cancelled") {
      return {
        label: "Cancelled",
        icon: XCircle,
        className:
          "border-red-400/20 bg-red-500/10 text-red-400",
      };
    }

    return {
      label: "Processing",
      icon: Clock3,
      className:
        "border-orange-400/20 bg-orange-500/10 text-orange-400",
    };
  };

  /* =========================================
     PAYMENT STATUS
  ========================================= */

  const getPaymentStatusConfig = (
    paymentStatus
  ) => {
    const normalized = String(
      paymentStatus || ""
    ).toLowerCase();

    if (normalized === "paid") {
      return {
        className:
          "border-emerald-400/20 bg-emerald-500/10 text-emerald-400",
        label: "Paid",
      };
    }

    if (normalized === "failed") {
      return {
        className:
          "border-red-400/20 bg-red-500/10 text-red-400",
        label: "Failed",
      };
    }

    if (normalized === "refunded") {
      return {
        className:
          "border-purple-400/20 bg-purple-500/10 text-purple-400",
        label: "Refunded",
      };
    }

    return {
      className:
        "border-orange-400/20 bg-orange-500/10 text-orange-400",
      label: "Pending",
    };
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05080d] text-white">
        <div className="flex min-h-[75vh] items-center justify-center">
          <Loader />
        </div>
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#05080d] text-white">

        <section className="mx-auto flex min-h-[75vh] max-w-2xl items-center justify-center px-4 py-16">

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

            {/* Error Icon */}

            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border
                border-red-400/20
                bg-red-500/10
                text-red-400
              "
            >
              <XCircle size={38} strokeWidth={1.5} />
            </div>

            <p
              className="
                mt-6
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-cyan-400
              "
            >
              NEXORA
            </p>

            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Order Not Found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              {error ||
                "We couldn't find the order you're looking for."}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <button
                type="button"
                onClick={fetchOrder}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-cyan-500
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-[#031018]
                  transition
                  hover:bg-cyan-400
                  active:scale-[0.98]
                "
              >
                <RefreshCw size={16} />
                Try Again
              </button>

              <Link
                to="/orders"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/[0.1]
                  bg-white/[0.03]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-gray-300
                  transition
                  hover:border-cyan-400/30
                  hover:bg-cyan-400/5
                  hover:text-cyan-400
                "
              >
                <ArrowLeft size={16} />
                Back to Orders
              </Link>

            </div>

          </div>

        </section>
      </main>
    );
  }

  /* =========================================
     ORDER DATA
  ========================================= */

  const orderItems =
    Array.isArray(order?.orderItems)
      ? order.orderItems
      : [];

  const status =
    order?.orderStatus || "Processing";

  const statusConfig =
    getStatusConfig(status);

  const StatusIcon =
    statusConfig.icon;

  const paymentStatus =
    order?.paymentStatus || "Pending";

  const paymentConfig =
    getPaymentStatusConfig(
      paymentStatus
    );

  const subtotal = Number(
    order?.itemsPrice || 0
  );

  const shipping = Number(
    order?.shippingPrice || 0
  );

  const tax = Number(
    order?.taxPrice || 0
  );

  const total = Number(
    order?.totalPrice || 0
  );

  const shippingAddress =
    order?.shippingAddress || {};

  const paymentMethod =
    order?.paymentMethod || "COD";

  const orderId =
    order?._id || id;

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-[#05080d] text-white">

      {/* =====================================
          TOP GLOW
      ===================================== */}

      <div
        className="
          pointer-events-none
          fixed
          left-1/2
          top-0
          -z-0
          h-80
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-cyan-500/[0.05]
          blur-[120px]
        "
      />

      {/* =====================================
          HEADER
      ===================================== */}

      <section
        className="
          relative
          border-b
          border-white/[0.06]
          bg-[#070b11]/90
          backdrop-blur-xl
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

          {/* Back */}

          <Link
            to="/orders"
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
            Back to Orders
          </Link>

          {/* Header Content */}

          <div
            className="
              mt-7
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >

            <div>

              <p
                className="
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
                  mt-2
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                "
              >
                Order #
                {String(orderId)
                  .slice(-8)
                  .toUpperCase()}
              </h1>

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  items-center
                  gap-4
                  text-sm
                  text-gray-500
                "
              >

                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={15} />
                  {formatDate(order?.createdAt)}
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-700" />

                <span>
                  {orderItems.length}{" "}
                  {orderItems.length === 1
                    ? "product"
                    : "products"}
                </span>

              </div>

            </div>

            {/* Status */}

            <div
              className={`
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-bold
                ${statusConfig.className}
              `}
            >
              <StatusIcon size={16} />
              {statusConfig.label}
            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          CONTENT
      ===================================== */}

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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* =================================
              LEFT
          ================================= */}

          <div className="space-y-8 lg:col-span-2">

            {/* =================================
                ORDER ITEMS
            ================================= */}

            <section
              className="
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                shadow-xl
                shadow-black/10
                backdrop-blur-xl
              "
            >

              {/* Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/[0.06]
                  px-5
                  py-5
                  sm:px-6
                "
              >

                <div>

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-cyan-400/10
                        text-cyan-400
                      "
                    >
                      <ShoppingBag size={17} />
                    </div>

                    <h2 className="text-lg font-black text-white">
                      Order Items
                    </h2>

                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    {orderItems.length}{" "}
                    {orderItems.length === 1
                      ? "product"
                      : "products"}{" "}
                    in this order
                  </p>

                </div>

              </div>

              {/* Items */}

              <div className="divide-y divide-white/[0.06]">

                {orderItems.map(
                  (item, index) => {

                    const name =
                      item?.name ||
                      "Product";

                    const quantity =
                      Number(
                        item?.quantity || 1
                      );

                    const price =
                      Number(
                        item?.price || 0
                      );

                    const itemSubtotal =
                      Number(
                        item?.subtotal ??
                          price *
                            quantity
                      );

                    /*
                      Backend order schema:
                      image is a String
                    */

                    const image =
                      typeof item?.image ===
                      "string"
                        ? item.image
                        : item?.image?.url ||
                          "/images/product-placeholder.jpg";

                    return (
                      <div
                        key={
                          item?._id ||
                          item?.product ||
                          index
                        }
                        className="
                          flex
                          gap-4
                          px-5
                          py-5
                          transition
                          hover:bg-white/[0.02]
                          sm:px-6
                        "
                      >

                        {/* Image */}

                        <Link
                          to={`/products/${item?.product}`}
                          className="
                            relative
                            flex
                            h-24
                            w-24
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-[#080d14]
                            sm:h-28
                            sm:w-28
                          "
                        >

                          <div
                            className="
                              pointer-events-none
                              absolute
                              left-1/2
                              top-1/2
                              h-16
                              w-16
                              -translate-x-1/2
                              -translate-y-1/2
                              rounded-full
                              bg-cyan-500/[0.07]
                              blur-2xl
                            "
                          />

                          <img
                            src={image}
                            alt={name}
                            className="
                              relative
                              z-10
                              h-full
                              w-full
                              object-contain
                              p-3
                            "
                            onError={(event) => {
                              event.currentTarget.src =
                                "/images/product-placeholder.jpg";
                            }}
                          />

                        </Link>

                        {/* Details */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <h3
                            className="
                              line-clamp-2
                              text-sm
                              font-bold
                              leading-5
                              text-white
                              sm:text-base
                            "
                          >
                            {name}
                          </h3>

                          <p
                            className="
                              mt-2
                              text-xs
                              text-gray-500
                            "
                          >
                            Quantity:{" "}
                            <span className="font-bold text-gray-300">
                              {quantity}
                            </span>
                          </p>

                          <p
                            className="
                              mt-2
                              text-xs
                              text-gray-500
                            "
                          >
                            {formatPrice(price)} ×{" "}
                            {quantity}
                          </p>

                        </div>

                        {/* Item Total */}

                        <div className="shrink-0 text-right">

                          <p
                            className="
                              text-sm
                              font-black
                              text-cyan-400
                              sm:text-base
                            "
                          >
                            {formatPrice(
                              itemSubtotal
                            )}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

            {/* =================================
                SHIPPING ADDRESS
            ================================= */}

            <section
              className="
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                p-5
                shadow-xl
                shadow-black/10
                backdrop-blur-xl
                sm:p-6
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
                    bg-cyan-400/10
                    text-cyan-400
                  "
                >
                  <MapPin size={18} />
                </div>

                <div>

                  <h2 className="text-lg font-black text-white">
                    Shipping Address
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-600">
                    Delivery information
                  </p>

                </div>

              </div>

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-[#080d14]
                  p-5
                "
              >

                <p className="font-bold text-white">
                  {shippingAddress?.fullName ||
                    "Customer"}
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  {shippingAddress?.address ||
                    "Address not available"}
                  <br />

                  {shippingAddress?.city &&
                    `${shippingAddress.city}`}

                  {shippingAddress?.postalCode &&
                    `, ${shippingAddress.postalCode}`}

                  <br />

                  {shippingAddress?.state &&
                    `${shippingAddress.state}, `}

                  {shippingAddress?.country ||
                    "Pakistan"}
                </p>

                {shippingAddress?.phone && (
                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      border-t
                      border-white/[0.06]
                      pt-4
                      text-sm
                      text-gray-500
                    "
                  >
                    <Phone
                      size={14}
                      className="text-cyan-400"
                    />

                    <span>
                      {shippingAddress.phone}
                    </span>
                  </div>
                )}

              </div>

            </section>

            {/* =================================
                ORDER INFORMATION
            ================================= */}

            <section
              className="
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                p-5
                shadow-xl
                shadow-black/10
                backdrop-blur-xl
                sm:p-6
              "
            >

              <h2 className="text-lg font-black text-white">
                Order Information
              </h2>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >

                {/* Payment Method */}

                <div
                  className="
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-[#080d14]
                    p-4
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-purple-400/10
                        text-purple-400
                      "
                    >
                      <CreditCard size={16} />
                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        Payment Method
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        {paymentMethod ===
                        "COD"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Payment Status */}

                <div
                  className="
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-[#080d14]
                    p-4
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-emerald-400/10
                        text-emerald-400
                      "
                    >
                      <ShieldCheck size={16} />
                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        Payment Status
                      </p>

                      <span
                        className={`
                          mt-1
                          inline-flex
                          rounded-full
                          border
                          px-2
                          py-0.5
                          text-xs
                          font-bold
                          ${paymentConfig.className}
                        `}
                      >
                        {paymentConfig.label}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* Created At */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-[#080d14]
                  p-4
                "
              >

                <CalendarDays
                  size={17}
                  className="text-cyan-400"
                />

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    Order Placed
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-300">
                    {formatDateTime(
                      order?.createdAt
                    )}
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* =================================
              RIGHT SUMMARY
          ================================= */}

          <aside>

            <div
              className="
                sticky
                top-24
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                shadow-2xl
                shadow-black/20
                backdrop-blur-xl
              "
            >

              {/* Accent */}

              <div
                className="
                  h-px
                  w-full
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-400
                  to-transparent
                "
              />

              <div className="p-5 sm:p-6">

                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-black text-white">
                    Order Summary
                  </h2>

                  <Package
                    size={19}
                    className="text-cyan-400"
                  />

                </div>

                {/* Price Details */}

                <div
                  className="
                    mt-6
                    space-y-4
                    border-b
                    border-white/[0.06]
                    pb-5
                  "
                >

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-semibold text-gray-300">
                      {formatPrice(
                        subtotal
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-gray-500">
                      Shipping
                    </span>

                    <span
                      className={
                        shipping === 0
                          ? "font-bold text-emerald-400"
                          : "font-semibold text-gray-300"
                      }
                    >
                      {shipping === 0
                        ? "FREE"
                        : formatPrice(
                            shipping
                          )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-gray-500">
                      Tax
                    </span>

                    <span className="font-semibold text-gray-300">
                      {formatPrice(tax)}
                    </span>

                  </div>

                </div>

                {/* Total */}

                <div className="flex items-end justify-between py-5">

                  <div>

                    <p className="text-sm font-bold text-white">
                      Total
                    </p>

                    <p className="mt-1 text-[10px] text-gray-600">
                      Including tax & shipping
                    </p>

                  </div>

                  <p className="text-2xl font-black text-cyan-400">
                    {formatPrice(total)}
                  </p>

                </div>

                {/* Status */}

                <div
                  className="
                    rounded-xl
                    border
                    border-cyan-400/10
                    bg-cyan-400/[0.04]
                    p-4
                  "
                >

                  <div className="flex items-center gap-2">

                    <StatusIcon
                      size={16}
                      className="text-cyan-400"
                    />

                    <p className="text-sm font-bold text-white">
                      {statusConfig.label}
                    </p>

                  </div>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Your order is currently{" "}
                    <span className="font-semibold text-gray-300">
                      {statusConfig.label.toLowerCase()}
                    </span>
                    .
                  </p>

                </div>

                {/* Buttons */}

                <div className="mt-5 space-y-3">

                  <Link
                    to="/orders"
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-white/[0.1]
                      bg-white/[0.03]
                      px-5
                      py-3.5
                      text-sm
                      font-bold
                      text-gray-300
                      transition
                      hover:border-cyan-400/20
                      hover:bg-cyan-400/5
                      hover:text-cyan-400
                    "
                  >
                    <ArrowLeft size={16} />
                    My Orders
                  </Link>

                  <Link
                    to="/products"
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-cyan-500
                      px-5
                      py-3.5
                      text-sm
                      font-black
                      text-[#031018]
                      shadow-lg
                      shadow-cyan-500/10
                      transition
                      hover:bg-cyan-400
                      active:scale-[0.98]
                    "
                  >
                    Continue Shopping
                  </Link>

                </div>

                {/* Secure */}

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[10px]
                    font-medium
                    text-gray-600
                  "
                >
                  <ShieldCheck
                    size={13}
                    className="text-emerald-400"
                  />
                  Secure NEXORA order
                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>

      {/* =====================================
          BOTTOM TRUST
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
            gap-5
            px-4
            py-8
            sm:grid-cols-3
            sm:px-6
            lg:px-8
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-cyan-400/10
                text-cyan-400
              "
            >
              <ShieldCheck size={18} />
            </div>

            <div>

              <p className="text-xs font-bold text-white">
                Secure Order
              </p>

              <p className="mt-1 text-[10px] text-gray-600">
                Your order details are protected.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-400/10
                text-blue-400
              "
            >
              <Truck size={18} />
            </div>

            <div>

              <p className="text-xs font-bold text-white">
                Fast Delivery
              </p>

              <p className="mt-1 text-[10px] text-gray-600">
                Reliable delivery to your doorstep.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-400/10
                text-emerald-400
              "
            >
              <CheckCircle2 size={18} />
            </div>

            <div>

              <p className="text-xs font-bold text-white">
                NEXORA Warranty
              </p>

              <p className="mt-1 text-[10px] text-gray-600">
                Quality laptops, trusted service.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default OrderDetails;
