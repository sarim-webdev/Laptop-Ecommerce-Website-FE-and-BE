import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";

import orderService from "../../services/orderService";
import Loader from "../../components/common/Loader";
import { formatPrice } from "../../utils/formatPrice";

/* =========================================
   MY ORDERS
========================================= */

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  /* =========================================
     FETCH ORDERS
  ========================================= */

  const fetchOrders = useCallback(async (page = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * Backend:
       * GET /api/orders/my-orders?page=1&limit=10
       */

      const response = await orderService.getMyOrders({
        page,
        limit: 10,
      });

      /*
       * Backend successResponse structure may be:
       *
       * {
       *   success: true,
       *   message: "...",
       *   data: {
       *      orders: [],
       *      pagination: {}
       *   }
       * }
       */

      const responseData = response?.data || response;

      const orderData = responseData?.orders || [];

      const paginationData = responseData?.pagination;

      setOrders(Array.isArray(orderData) ? orderData : []);

      if (paginationData) {
        setPagination({
          currentPage: paginationData.currentPage || page,
          totalPages: paginationData.totalPages || 1,
          totalOrders: paginationData.totalOrders || 0,
          limit: paginationData.limit || 10,
          hasNextPage: Boolean(paginationData.hasNextPage),
          hasPreviousPage: Boolean(
            paginationData.hasPreviousPage
          ),
        });
      } else {
        setPagination((previous) => ({
          ...previous,
          currentPage: page,
          totalPages: 1,
          totalOrders: orderData.length,
          hasNextPage: false,
          hasPreviousPage: page > 1,
        }));
      }
    } catch (err) {
      console.error("Failed to load orders:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  /* =========================================
     CHANGE PAGE
  ========================================= */

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.currentPage
    ) {
      return;
    }

    fetchOrders(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     STATUS CONFIG
  ========================================= */

  const getStatusConfig = (status) => {
    const normalizedStatus = String(status || "")
      .toLowerCase()
      .trim();

    const statusMap = {
      processing: {
        label: "Processing",
        className:
          "border-amber-400/15 bg-amber-400/[0.07] text-amber-300",
        dot: "bg-amber-400",
      },

      confirmed: {
        label: "Confirmed",
        className:
          "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300",
        dot: "bg-cyan-400",
      },

      shipped: {
        label: "Shipped",
        className:
          "border-blue-400/15 bg-blue-400/[0.07] text-blue-300",
        dot: "bg-blue-400",
      },

      delivered: {
        label: "Delivered",
        className:
          "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300",
        dot: "bg-emerald-400",
      },

      cancelled: {
        label: "Cancelled",
        className:
          "border-red-400/15 bg-red-400/[0.07] text-red-300",
        dot: "bg-red-400",
      },

      canceled: {
        label: "Cancelled",
        className:
          "border-red-400/15 bg-red-400/[0.07] text-red-300",
        dot: "bg-red-400",
      },
    };

    return (
      statusMap[normalizedStatus] || {
        label: status || "Pending",
        className:
          "border-gray-400/15 bg-gray-400/[0.07] text-gray-300",
        dot: "bg-gray-400",
      }
    );
  };

  /* =========================================
     PAYMENT CONFIG
  ========================================= */

  const getPaymentLabel = (paymentMethod) => {
    if (paymentMethod === "ONLINE") {
      return "Online Payment";
    }

    if (paymentMethod === "COD") {
      return "Cash on Delivery";
    }

    return paymentMethod || "N/A";
  };

  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05080d]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader />
        </div>
      </main>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-[#05080d] text-white">

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="border-b border-white/[0.06] bg-[#070b11]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

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
                My Orders
              </h1>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-gray-500
                  sm:text-base
                "
              >
                View your order history, check order status,
                and track your NEXORA laptop purchases.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                fetchOrders(
                  pagination.currentPage,
                  true
                )
              }
              disabled={refreshing}
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                px-4
                py-3
                text-sm
                font-bold
                text-gray-300
                transition-all
                duration-300
                hover:border-cyan-400/20
                hover:bg-cyan-400/[0.05]
                hover:text-cyan-400
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              Refresh
            </button>

          </div>

        </div>
      </section>

      {/* =====================================
          CONTENT
      ===================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ===================================
            ERROR
        =================================== */}

        {error && (
          <div
            className="
              mb-6
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-red-400/10
              bg-red-500/[0.05]
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-sm font-bold text-red-300">
                Unable to load orders
              </p>

              <p className="mt-1 text-xs text-red-300/70">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchOrders(
                  pagination.currentPage
                )
              }
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-lg
                bg-red-500/10
                px-4
                py-2.5
                text-xs
                font-bold
                text-red-300
                transition
                hover:bg-red-500/20
              "
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* ===================================
            TOP STATS
        =================================== */}

        {!error && orders.length > 0 && (
          <div
            className="
              mb-8
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-3
            "
          >

            {/* Total Orders */}

            <div
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.03]
                p-5
                backdrop-blur-xl
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
                    bg-cyan-400/[0.08]
                    text-cyan-400
                  "
                >
                  <ShoppingBag size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600">
                    Total Orders
                  </p>

                  <p className="mt-1 text-xl font-black text-white">
                    {pagination.totalOrders}
                  </p>
                </div>

              </div>
            </div>

            {/* Current Page */}

            <div
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.03]
                p-5
                backdrop-blur-xl
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
                    bg-blue-400/[0.08]
                    text-blue-400
                  "
                >
                  <Package size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600">
                    Current Page
                  </p>

                  <p className="mt-1 text-xl font-black text-white">
                    {pagination.currentPage}
                    <span className="ml-1 text-sm text-gray-600">
                      / {pagination.totalPages}
                    </span>
                  </p>
                </div>

              </div>
            </div>

            {/* Delivery */}

            <div
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.03]
                p-5
                backdrop-blur-xl
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
                    bg-emerald-400/[0.08]
                    text-emerald-400
                  "
                >
                  <Truck size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600">
                    Secure Delivery
                  </p>

                  <p className="mt-1 text-sm font-black text-white">
                    NEXORA Protected
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ===================================
            EMPTY
        =================================== */}

        {!error && orders.length === 0 && (
          <div className="flex min-h-[450px] items-center justify-center">

            <div
              className="
                w-full
                max-w-lg
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
                <ShoppingBag size={36} />
              </div>

              <h2
                className="
                  mt-6
                  text-2xl
                  font-black
                  text-white
                  sm:text-3xl
                "
              >
                No Orders Yet
              </h2>

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
                You haven't placed any orders yet.
                Explore our collection and find your
                perfect NEXORA laptop.
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
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>
        )}

        {/* ===================================
            ORDERS
        =================================== */}

        {orders.length > 0 && (
          <div className="space-y-5">

            {orders.map((order) => {

              const orderId =
                order?._id ||
                order?.id;

              /*
               * Backend uses orderItems
               */

              const orderItems =
                Array.isArray(order?.orderItems)
                  ? order.orderItems
                  : [];

              /*
               * Backend uses totalPrice
               */

              const total = Number(
                order?.totalPrice ?? 0
              );

              /*
               * Backend uses orderStatus
               */

              const status =
                order?.orderStatus ||
                "Processing";

              const statusConfig =
                getStatusConfig(status);

              const createdAt =
                order?.createdAt;

              const paymentMethod =
                order?.paymentMethod;

              const paymentStatus =
                order?.paymentStatus ||
                "Pending";

              return (
                <article
                  key={orderId}
                  className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/[0.08]
                    bg-white/[0.035]
                    shadow-2xl
                    shadow-black/10
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:border-cyan-400/10
                    hover:bg-white/[0.045]
                  "
                >

                  {/* =================================
                      ORDER HEADER
                  ================================= */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      border-b
                      border-white/[0.06]
                      px-5
                      py-5
                      sm:px-6
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                    "
                  >

                    <div className="flex flex-wrap gap-x-8 gap-y-4">

                      {/* Order ID */}

                      <div>
                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-gray-600
                          "
                        >
                          Order
                        </p>

                        <p
                          className="
                            mt-1
                            font-mono
                            text-sm
                            font-bold
                            text-gray-300
                          "
                        >
                          #
                          {orderId
                            ?.slice(-8)
                            ?.toUpperCase() || "N/A"}
                        </p>
                      </div>

                      {/* Date */}

                      <div>
                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-gray-600
                          "
                        >
                          Ordered On
                        </p>

                        <div
                          className="
                            mt-1
                            flex
                            items-center
                            gap-1.5
                            text-sm
                            font-semibold
                            text-gray-300
                          "
                        >
                          <CalendarDays
                            size={14}
                            className="text-gray-600"
                          />

                          {formatDate(createdAt)}
                        </div>
                      </div>

                      {/* Total */}

                      <div>
                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-gray-600
                          "
                        >
                          Total
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-black
                            text-cyan-400
                          "
                        >
                          {formatPrice(total)}
                        </p>
                      </div>

                    </div>

                    {/* Status */}

                    <span
                      className={`
                        inline-flex
                        w-fit
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-3.5
                        py-2
                        text-xs
                        font-bold
                        ${statusConfig.className}
                      `}
                    >
                      <span
                        className={`
                          h-1.5
                          w-1.5
                          rounded-full
                          ${statusConfig.dot}
                        `}
                      />

                      {statusConfig.label}
                    </span>

                  </div>

                  {/* =================================
                      ORDER BODY
                  ================================= */}

                  <div className="px-5 py-5 sm:px-6">

                    {/* Items */}

                    <div className="space-y-4">

                      {orderItems
                        .slice(0, 3)
                        .map((item, index) => {

                          /*
                           * IMPORTANT:
                           *
                           * Backend order item contains:
                           *
                           * {
                           *   product,
                           *   name,
                           *   image,
                           *   price,
                           *   quantity,
                           *   subtotal
                           * }
                           */

                          const product =
                            item?.product || {};

                          const productName =
                            item?.name ||
                            product?.name ||
                            "Product";

                          const quantity =
                            Number(
                              item?.quantity || 1
                            );

                          const price =
                            Number(
                              item?.price || 0
                            );

                          const subtotal =
                            Number(
                              item?.subtotal ??
                                price * quantity
                            );

                          /*
                           * Backend snapshot image.
                           *
                           * This is the important fix.
                           */

                          const image =
                            typeof item?.image ===
                            "string"
                              ? item.image
                              : item?.image?.url ||
                                product?.images?.[0]?.url ||
                                product?.images?.[0] ||
                                "";

                          return (
                            <div
                              key={
                                item?._id ||
                                product?._id ||
                                index
                              }
                              className="
                                flex
                                gap-4
                              "
                            >

                              {/* Product Image */}

                              <div
                                className="
                                  relative
                                  flex
                                  h-20
                                  w-24
                                  shrink-0
                                  items-center
                                  justify-center
                                  overflow-hidden
                                  rounded-xl
                                  border
                                  border-white/[0.06]
                                  bg-[#080d14]
                                  p-1
                                "
                              >

                                {image ? (
                                  <img
                                    src={image}
                                    alt={productName}
                                    className="
                                      h-full
                                      w-full
                                      object-contain
                                    "
                                  />
                                ) : (
                                  <Package
                                    size={22}
                                    className="text-gray-700"
                                  />
                                )}

                              </div>

                              {/* Product Info */}

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
                                    text-gray-200
                                  "
                                >
                                  {productName}
                                </h3>

                                <div
                                  className="
                                    mt-2
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-4
                                    gap-y-1
                                  "
                                >

                                  <p
                                    className="
                                      text-xs
                                      text-gray-600
                                    "
                                  >
                                    Qty:{" "}
                                    <span className="text-gray-400">
                                      {quantity}
                                    </span>
                                  </p>

                                  <p
                                    className="
                                      text-xs
                                      text-gray-600
                                    "
                                  >
                                    Price:{" "}
                                    <span className="text-gray-400">
                                      {formatPrice(price)}
                                    </span>
                                  </p>

                                </div>

                              </div>

                              {/* Item Subtotal */}

                              <div
                                className="
                                  shrink-0
                                  text-right
                                "
                              >

                                <p
                                  className="
                                    text-xs
                                    font-black
                                    text-white
                                  "
                                >
                                  {formatPrice(subtotal)}
                                </p>

                              </div>

                            </div>
                          );
                        })}

                    </div>

                    {/* More Items */}

                    {orderItems.length > 3 && (
                      <p
                        className="
                          mt-4
                          text-xs
                          font-semibold
                          text-gray-600
                        "
                      >
                        + {orderItems.length - 3} more{" "}
                        {orderItems.length - 3 === 1
                          ? "item"
                          : "items"}
                      </p>
                    )}

                    {/* =================================
                        ORDER META
                    ================================= */}

                    <div
                      className="
                        mt-6
                        grid
                        grid-cols-1
                        gap-3
                        border-t
                        border-white/[0.06]
                        pt-5
                        sm:grid-cols-2
                      "
                    >

                      {/* Payment */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-white/[0.05]
                          bg-black/10
                          px-4
                          py-3
                        "
                      >

                        <CreditCard
                          size={17}
                          className="shrink-0 text-cyan-400"
                        />

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                            Payment
                          </p>

                          <p className="mt-0.5 text-xs font-semibold text-gray-400">
                            {getPaymentLabel(
                              paymentMethod
                            )}
                          </p>
                        </div>

                        <span
                          className={`
                            ml-auto
                            rounded-full
                            px-2
                            py-1
                            text-[9px]
                            font-black
                            uppercase
                            ${
                              paymentStatus ===
                              "Paid"
                                ? "bg-emerald-400/10 text-emerald-400"
                                : "bg-amber-400/10 text-amber-400"
                            }
                          `}
                        >
                          {paymentStatus}
                        </span>

                      </div>

                      {/* Delivery */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-white/[0.05]
                          bg-black/10
                          px-4
                          py-3
                        "
                      >

                        <Truck
                          size={17}
                          className="shrink-0 text-cyan-400"
                        />

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                            Delivery
                          </p>

                          <p className="mt-0.5 text-xs font-semibold text-gray-400">
                            {order?.shippingAddress
                              ?.city ||
                              "Address provided"}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* =================================
                        VIEW DETAILS
                    ================================= */}

                    <div
                      className="
                        mt-5
                        flex
                        justify-end
                        border-t
                        border-white/[0.06]
                        pt-5
                      "
                    >

                      <Link
                        to={`/orders/${orderId}`}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-cyan-400/10
                          bg-cyan-400/[0.05]
                          px-4
                          py-2.5
                          text-xs
                          font-black
                          text-cyan-400
                          transition-all
                          duration-300
                          hover:border-cyan-400/20
                          hover:bg-cyan-400/[0.1]
                        "
                      >
                        View Order Details
                        <ArrowRight size={15} />
                      </Link>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* ===================================
            PAGINATION
        =================================== */}

        {pagination.totalPages > 1 && (
          <div
            className="
              mt-8
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.03]
              px-4
              py-4
            "
          >

            <button
              type="button"
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                handlePageChange(
                  pagination.currentPage - 1
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.07]
                bg-black/10
                px-3
                py-2
                text-xs
                font-bold
                text-gray-400
                transition
                hover:border-cyan-400/20
                hover:text-cyan-400
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <ChevronLeft size={15} />
              Previous
            </button>

            <div className="text-center">

              <p className="text-xs font-bold text-gray-500">
                Page{" "}
                <span className="text-cyan-400">
                  {pagination.currentPage}
                </span>{" "}
                of{" "}
                <span className="text-gray-300">
                  {pagination.totalPages}
                </span>
              </p>

              <p className="mt-1 text-[10px] text-gray-700">
                {pagination.totalOrders} total orders
              </p>

            </div>

            <button
              type="button"
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                handlePageChange(
                  pagination.currentPage + 1
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.07]
                bg-black/10
                px-3
                py-2
                text-xs
                font-bold
                text-gray-400
                transition
                hover:border-cyan-400/20
                hover:text-cyan-400
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              Next
              <ChevronRight size={15} />
            </button>

          </div>
        )}

      </section>
    </main>
  );
};

export default MyOrders;
