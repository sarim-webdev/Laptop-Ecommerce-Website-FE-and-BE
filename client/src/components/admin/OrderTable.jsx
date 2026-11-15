import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

const OrderTable = ({
  orders = [],
  loading = false,
  onStatusChange,
}) => {
  /* =========================================
     HELPERS
  ========================================= */

  const getOrderId = (order) =>
    order?._id || order?.id;

  const getOrderNumber = (order) =>
    order?.orderNumber ||
    order?.orderNo ||
    getOrderId(order)?.slice(-8) ||
    "N/A";

  const getCustomer = (order) =>
    order?.user ||
    order?.customer ||
    {};

  const getCustomerName = (order) => {
    const customer = getCustomer(order);

    return (
      customer?.name ||
      order?.shippingAddress?.fullName ||
      "Guest Customer"
    );
  };

  const getCustomerEmail = (order) => {
    const customer = getCustomer(order);

    return (
      customer?.email ||
      order?.email ||
      "No email"
    );
  };

  const getStatus = (order) =>
    order?.orderStatus ||
    order?.status ||
    "Processing";

  const getTotal = (order) =>
    Number(
      order?.totalPrice ||
      order?.totalAmount ||
      order?.total ||
      0
    );

  /* =========================================
     STATUS STYLES
  ========================================= */

  const getStatusStyle = (status) => {
    const styles = {
      Processing:
        "bg-amber-400/10 text-amber-400 border-amber-400/20",

      Confirmed:
        "bg-sky-400/10 text-sky-400 border-sky-400/20",

      Shipped:
        "bg-purple-400/10 text-purple-400 border-purple-400/20",

      Delivered:
        "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",

      Cancelled:
        "bg-red-400/10 text-red-400 border-red-400/20",
    };

    return (
      styles[status] ||
      "bg-slate-400/10 text-slate-400 border-slate-400/20"
    );
  };

  /* =========================================
     UPDATE STATUS
  ========================================= */

  const handleStatusChange = async (
    order,
    newStatus
  ) => {
    const orderId = getOrderId(order);

    if (!orderId || !onStatusChange) return;

    try {
      await onStatusChange(
        orderId,
        newStatus
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );
    }
  };

  /* =========================================
     LOADING STATE
  ========================================= */

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#263449] bg-[#0B1220] shadow-sm">

        <div className="flex items-center justify-center px-6 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#263449] border-t-sky-400" />
        </div>

      </div>
    );
  }

  /* =========================================
     EMPTY STATE
  ========================================= */

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-[#263449] bg-[#0B1220] px-6 py-16 text-center shadow-sm">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#111C2E] text-2xl">
          📦
        </div>

        <h3 className="mt-4 text-lg font-bold text-white">
          No orders found
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          There are currently no orders to display.
        </p>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#263449] bg-[#0B1220] shadow-sm">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-[#263449] px-6 py-5">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-lg font-bold text-white">
              Orders
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Manage and track customer orders.
            </p>
          </div>

          <span className="w-fit rounded-full border border-[#263449] bg-[#111C2E] px-3 py-1 text-xs font-semibold text-slate-300">
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </span>

        </div>

      </div>

      {/* =========================================
          TABLE
      ========================================= */}

      <div className="overflow-x-auto">

        <table className="min-w-[1000px] w-full">

          <thead className="bg-[#111C2E]">

            <tr className="border-b border-[#263449] text-left">

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Order
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Items
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Total
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Action
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-[#263449]">

            {orders.map((order) => {
              const orderId =
                getOrderId(order);

              const status =
                getStatus(order);

              const items =
                order?.orderItems ||
                order?.items ||
                [];

              return (
                <tr
                  key={orderId}
                  className="transition hover:bg-[#172338]"
                >

                  {/* Order */}

                  <td className="px-6 py-4">

                    <Link
                      to={`/admin/orders/${orderId}`}
                      className="font-bold text-white hover:text-sky-400"
                    >
                      #{getOrderNumber(order)}
                    </Link>

                    <p className="mt-1 text-xs text-slate-400">
                      {order?.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </p>

                  </td>

                  {/* Customer */}

                  <td className="px-6 py-4">

                    <p className="text-sm font-semibold text-slate-200">
                      {getCustomerName(order)}
                    </p>

                    <p className="mt-1 max-w-[200px] truncate text-xs text-slate-400">
                      {getCustomerEmail(order)}
                    </p>

                  </td>

                  {/* Items */}

                  <td className="px-6 py-4">

                    <span className="rounded-full border border-[#263449] bg-[#111C2E] px-3 py-1 text-xs font-semibold text-slate-300">
                      {items.length}{" "}
                      {items.length === 1
                        ? "item"
                        : "items"}
                    </span>

                  </td>

                  {/* Total */}

                  <td className="px-6 py-4">

                    <span className="text-sm font-bold text-slate-200">
                      {formatPrice(
                        getTotal(order)
                      )}
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">

                    <select
                      value={status}
                      onChange={(event) =>
                        handleStatusChange(
                          order,
                          event.target.value
                        )
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold outline-none ${getStatusStyle(
                        status
                      )}`}
                    >
                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>

                  </td>

                  {/* Action */}

                  <td className="px-6 py-4 text-right">

                    <Link
                      to={`/admin/orders/${orderId}`}
                      className="inline-flex rounded-lg bg-sky-400 px-3 py-2 text-sm font-semibold text-[#0B1220] transition hover:bg-sky-300"
                    >
                      View
                    </Link>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default OrderTable;