import { useEffect, useMemo, useState } from "react";

import orderService from "../../services/orderService";
import Loader from "../../components/common/Loader";


/* =========================================
   ADMIN ORDERS
========================================= */

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);


  /* =========================================
     FETCH ORDERS
  ========================================= */

  const fetchOrders = async () => {
    try {
      setError("");

      const response =
        await orderService.getAllOrders();

      const ordersData =
        response?.data?.orders ||
        response?.orders ||
        response?.data ||
        [];

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to load orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    fetchOrders();
  }, []);


  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };


  /* =========================================
     UPDATE ORDER STATUS
  ========================================= */

  const handleStatusChange = async (
    orderId,
    orderStatus
  ) => {
    try {
      setError("");

      const response =
        await orderService.updateOrderStatus(
          orderId,
          { orderStatus }
        );

      const updatedOrder =
        response?.data?.order ||
        response?.order;

      if (updatedOrder) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? updatedOrder
              : order
          )
        );

        if (
          selectedOrder?._id === orderId
        ) {
          setSelectedOrder(updatedOrder);
        }
      } else {
        await fetchOrders();
      }
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to update order status."
      );
    }
  };


  /* =========================================
     FILTER ORDERS
  ========================================= */

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") {
      return orders;
    }

    return orders.filter(
      (order) =>
        order.orderStatus === statusFilter
    );
  }, [orders, statusFilter]);


  /* =========================================
     STATUS BADGE
  ========================================= */

  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";

      case "Shipped":
        return "border-blue-400/20 bg-blue-400/10 text-blue-400";

      case "Confirmed":
        return "border-indigo-400/20 bg-indigo-400/10 text-indigo-400";

      case "Cancelled":
        return "border-red-400/20 bg-red-400/10 text-red-400";

      default:
        return "border-amber-400/20 bg-amber-400/10 text-amber-400";
    }
  };


  /* =========================================
     FORMAT PRICE
  ========================================= */

  const formatPrice = (price) => {
    return `Rs. ${Number(
      price || 0
    ).toLocaleString()}`;
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#05080d]">
        <Loader />
      </div>
    );
  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05080d] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

      {/* =====================================
          BACKGROUND GLOWS
      ===================================== */}

      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/[0.05] blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/[0.03] blur-3xl" />


      <div className="relative mx-auto max-w-7xl space-y-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              NEXORA ADMINISTRATION
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Orders
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage customer orders and monitor
              order fulfillment.
            </p>

          </div>


          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#0b1119] px-5 py-2.5 text-sm font-semibold text-slate-300 shadow-lg shadow-black/20 transition-all duration-300 hover:border-cyan-400/30 hover:bg-[#101923] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3">

            <p className="text-sm font-medium text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchOrders}
              className="shrink-0 text-sm font-semibold text-red-400 underline underline-offset-4"
            >
              Retry
            </button>

          </div>
        )}


        {/* =====================================
            STATS
        ===================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Orders */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">

            <p className="text-sm font-medium text-slate-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-black text-white">
              {orders.length}
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-cyan-400" />

          </div>


          {/* Processing */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-amber-400/20">

            <p className="text-sm font-medium text-slate-500">
              Processing
            </p>

            <p className="mt-2 text-3xl font-black text-amber-400">
              {
                orders.filter(
                  (order) =>
                    order.orderStatus ===
                    "Processing"
                ).length
              }
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-amber-400" />

          </div>


          {/* Shipped */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20">

            <p className="text-sm font-medium text-slate-500">
              Shipped
            </p>

            <p className="mt-2 text-3xl font-black text-blue-400">
              {
                orders.filter(
                  (order) =>
                    order.orderStatus ===
                    "Shipped"
                ).length
              }
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-blue-400" />

          </div>


          {/* Delivered */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20">

            <p className="text-sm font-medium text-slate-500">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-400">
              {
                orders.filter(
                  (order) =>
                    order.orderStatus ===
                    "Delivered"
                ).length
              }
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-emerald-400" />

          </div>

        </div>


        {/* =====================================
            FILTER
        ===================================== */}

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/30">

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Order Management
              </span>

              <h2 className="mt-1 text-lg font-bold text-white">
                Order Status
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Filter orders by their current status.
              </p>

            </div>


            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-white/10 bg-[#0a1018] px-4 py-2.5 text-sm font-semibold text-slate-300 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
            >

              <option
                value="All"
                className="bg-[#0a1018]"
              >
                All Orders
              </option>

              <option
                value="Processing"
                className="bg-[#0a1018]"
              >
                Processing
              </option>

              <option
                value="Confirmed"
                className="bg-[#0a1018]"
              >
                Confirmed
              </option>

              <option
                value="Shipped"
                className="bg-[#0a1018]"
              >
                Shipped
              </option>

              <option
                value="Delivered"
                className="bg-[#0a1018]"
              >
                Delivered
              </option>

              <option
                value="Cancelled"
                className="bg-[#0a1018]"
              >
                Cancelled
              </option>

            </select>

          </div>

        </div>


        {/* =====================================
            ORDERS TABLE
        ===================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/30">

          {/* Table Header */}

          <div className="border-b border-white/10 px-6 py-5">

            <div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Order Management
              </span>

              <h2 className="mt-1 text-lg font-bold text-white">
                All Customer Orders
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Review and manage customer orders.
              </p>

            </div>

          </div>


          {/* Empty State */}

          {filteredOrders.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#070c12] text-2xl shadow-lg">
                📦
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">
                No orders found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Orders matching this filter
                will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                {/* Table Head */}

                <thead className="border-b border-white/10 bg-white/[0.02]">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Items
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                {/* Table Body */}

                <tbody className="divide-y divide-white/[0.06]">

                  {filteredOrders.map(
                    (order) => {

                      const items =
                        order.orderItems ||
                        order.items ||
                        [];

                      const customer =
                        order.user?.name ||
                        order.shippingAddress
                          ?.fullName ||
                        "Customer";

                      return (

                        <tr
                          key={order._id}
                          className="transition duration-300 hover:bg-white/[0.025]"
                        >

                          {/* Order */}

                          <td className="whitespace-nowrap px-6 py-5">

                            <p className="font-bold text-white">
                              #
                              {order._id
                                ?.slice(-8)
                                .toUpperCase()}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {order.createdAt
                                ? new Date(
                                    order.createdAt
                                  ).toLocaleDateString()
                                : "—"}
                            </p>

                          </td>


{/* Customer */}

<td className="px-6 py-5">

  <div className="flex items-center gap-3">

    {/* Customer Avatar */}

    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-cyan-400/10 bg-cyan-400/5">

      {order.user?.avatar?.url ? (
        <img
          src={order.user.avatar.url}
          alt={customer}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-cyan-400">
          {(customer || "C")
            .charAt(0)
            .toUpperCase()}
        </div>
      )}

    </div>


    {/* Customer Information */}

    <div className="min-w-0">

      <p className="max-w-[180px] truncate font-semibold text-white">
        {customer}
      </p>

      <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">
        {order.user?.email ||
          order.shippingAddress?.phone ||
          "—"}
      </p>

    </div>

  </div>

</td>



                          {/* Items */}

                          <td className="whitespace-nowrap px-6 py-5">

                            <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-400">
                              {items.length}{" "}
                              {items.length === 1
                                ? "item"
                                : "items"}
                            </span>

                          </td>


                          {/* Total */}

                          <td className="whitespace-nowrap px-6 py-5">

                            <p className="text-sm font-bold text-white">
                              {formatPrice(
                                order.totalPrice ||
                                order.totalAmount ||
                                order.total
                              )}
                            </p>

                          </td>


                          {/* Status */}

                          <td className="whitespace-nowrap px-6 py-5">

                            <select
                              value={
                                order.orderStatus ||
                                "Processing"
                              }
                              onChange={(event) =>
                                handleStatusChange(
                                  order._id,
                                  event.target.value
                                )
                              }
                              className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-cyan-400/20 ${getStatusClasses(
                                order.orderStatus
                              )}`}
                            >

                              <option
                                value="Processing"
                                className="bg-[#0a1018] text-amber-400"
                              >
                                Processing
                              </option>

                              <option
                                value="Confirmed"
                                className="bg-[#0a1018] text-indigo-400"
                              >
                                Confirmed
                              </option>

                              <option
                                value="Shipped"
                                className="bg-[#0a1018] text-blue-400"
                              >
                                Shipped
                              </option>

                              <option
                                value="Delivered"
                                className="bg-[#0a1018] text-emerald-400"
                              >
                                Delivered
                              </option>

                              <option
                                value="Cancelled"
                                className="bg-[#0a1018] text-red-400"
                              >
                                Cancelled
                              </option>

                            </select>

                          </td>


                          {/* Actions */}

                          <td className="whitespace-nowrap px-6 py-5 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedOrder(
                                  order
                                )
                              }
                              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400"
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* =====================================
          ORDER DETAILS MODAL
      ===================================== */}

      {selectedOrder && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1119] shadow-2xl shadow-black/60">

            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1119]/95 px-6 py-5 backdrop-blur">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                  NEXORA ORDER
                </p>

                <h2 className="mt-1 text-lg font-bold text-white">
                  Order Details
                </h2>

                <p className="text-sm text-slate-500">
                  #
                  {selectedOrder._id
                    ?.slice(-8)
                    .toUpperCase()}
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-500 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-400"
              >
                ✕
              </button>

            </div>


            {/* Modal Body */}

            <div className="space-y-6 px-6 py-6">

              {/* =====================================
                  CUSTOMER
              ===================================== */}

              <div className="rounded-2xl border border-white/10 bg-[#070c12] p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                    👤
                  </div>

                  <div>

                    <h3 className="font-bold text-white">
                      Customer
                    </h3>

                    <p className="text-xs text-slate-500">
                      Customer information
                    </p>

                  </div>

                </div>


                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Name
                    </p>

                    <p className="mt-2 text-sm font-semibold text-white">
                      {selectedOrder.user?.name ||
                        selectedOrder
                          .shippingAddress
                          ?.fullName ||
                        "—"}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold text-white">
                      {selectedOrder.user?.email ||
                        "—"}
                    </p>

                  </div>

                </div>

              </div>


              {/* =====================================
                  SHIPPING
              ===================================== */}

              {selectedOrder.shippingAddress && (

                <div className="rounded-2xl border border-white/10 bg-[#070c12] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-400">
                      📍
                    </div>

                    <div>

                      <h3 className="font-bold text-white">
                        Shipping Address
                      </h3>

                      <p className="text-xs text-slate-500">
                        Delivery information
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#05080d] p-4 text-sm leading-7 text-slate-400">

                    <p className="font-semibold text-white">
                      {
                        selectedOrder
                          .shippingAddress
                          .fullName
                      }
                    </p>

                    <p>
                      {
                        selectedOrder
                          .shippingAddress
                          .phone
                      }
                    </p>

                    <p>
                      {
                        selectedOrder
                          .shippingAddress
                          .address
                      }
                    </p>

                    <p>
                      {
                        selectedOrder
                          .shippingAddress
                          .city
                      }

                      {selectedOrder
                        .shippingAddress
                        .state
                        ? `, ${selectedOrder.shippingAddress.state}`
                        : ""}
                    </p>

                    <p>
                      {
                        selectedOrder
                          .shippingAddress
                          .country
                      }
                    </p>

                  </div>

                </div>

              )}


              {/* =====================================
                  ORDER ITEMS
              ===================================== */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <div>

                    <h3 className="font-bold text-white">
                      Order Items
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Products included in this order
                    </p>

                  </div>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
                    {
                      (
                        selectedOrder.orderItems ||
                        selectedOrder.items ||
                        []
                      ).length
                    }{" "}
                    Items
                  </span>

                </div>


                <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/10 bg-[#070c12]">

                  {(
                    selectedOrder.orderItems ||
                    selectedOrder.items ||
                    []
                  ).map(
                    (item, index) => {

                      const product =
                        item.product || {};

                      const image =
                        product.images?.[0]
                          ?.url ||
                        product.images?.[0] ||
                        product.image ||
                        "/images/product-placeholder.jpg";

                      return (

                        <div
                          key={
                            item._id ||
                            index
                          }
                          className="flex items-center gap-4 p-4 transition hover:bg-white/[0.02]"
                        >

                          {/* Product Image */}

                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#05080d]">

                            <img
                              src={image}
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />

                          </div>


                          {/* Product */}

                          <div className="min-w-0 flex-1">

                            <p className="truncate font-semibold text-white">
                              {product.name ||
                                item.name ||
                                "Product"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Qty:{" "}
                              {item.quantity ||
                                1}
                            </p>

                          </div>


                          {/* Price */}

                          <p className="text-sm font-bold text-cyan-400">
                            {formatPrice(
                              item.price ||
                              product.price
                            )}
                          </p>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>


              {/* =====================================
                  PAYMENT + STATUS
              ===================================== */}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Payment */}

                <div className="rounded-2xl border border-white/10 bg-[#070c12] p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Payment Method
                  </p>

                  <p className="mt-3 font-bold text-white">
                    {selectedOrder.paymentMethod ||
                      "—"}
                  </p>

                </div>


                {/* Status */}

                <div className="rounded-2xl border border-white/10 bg-[#070c12] p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Order Status
                  </p>

                  <span
                    className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus ||
                      "Processing"}
                  </span>

                </div>

              </div>


              {/* =====================================
                  TOTAL
              ===================================== */}

              <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/10 bg-gradient-to-r from-cyan-400/[0.06] to-blue-500/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-400">
                    Order Total
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Final order amount
                  </p>

                </div>

                <span className="text-2xl font-black text-cyan-400">
                  {formatPrice(
                    selectedOrder.totalPrice ||
                    selectedOrder.totalAmount ||
                    selectedOrder.total
                  )}
                </span>

              </div>

            </div>


            {/* Modal Footer */}

            <div className="flex justify-end border-t border-white/10 bg-[#070c12] px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
};


export default AdminOrders;