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
        "bg-yellow-50 text-yellow-700 border-yellow-200",

      Confirmed:
        "bg-blue-50 text-blue-700 border-blue-200",

      Shipped:
        "bg-purple-50 text-purple-700 border-purple-200",

      Delivered:
        "bg-green-50 text-green-700 border-green-200",

      Cancelled:
        "bg-red-50 text-red-700 border-red-200",
    };

    return (
      styles[status] ||
      "bg-gray-50 text-gray-700 border-gray-200"
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
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-center px-6 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>

      </div>
    );
  }

  /* =========================================
     EMPTY STATE
  ========================================= */

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
          📦
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          No orders found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          There are currently no orders to display.
        </p>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-gray-200 px-6 py-5">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track customer orders.
            </p>
          </div>

          <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
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

          <thead className="bg-gray-50">

            <tr className="border-b border-gray-200 text-left">

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Order
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Customer
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Items
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Total
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                Action
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">

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
                  className="transition hover:bg-gray-50"
                >

                  {/* Order */}

                  <td className="px-6 py-4">

                    <Link
                      to={`/admin/orders/${orderId}`}
                      className="font-bold text-gray-900 hover:text-blue-600"
                    >
                      #{getOrderNumber(order)}
                    </Link>

                    <p className="mt-1 text-xs text-gray-500">
                      {order?.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </p>

                  </td>

                  {/* Customer */}

                  <td className="px-6 py-4">

                    <p className="text-sm font-semibold text-gray-900">
                      {getCustomerName(order)}
                    </p>

                    <p className="mt-1 max-w-[200px] truncate text-xs text-gray-500">
                      {getCustomerEmail(order)}
                    </p>

                  </td>

                  {/* Items */}

                  <td className="px-6 py-4">

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {items.length}{" "}
                      {items.length === 1
                        ? "item"
                        : "items"}
                    </span>

                  </td>

                  {/* Total */}

                  <td className="px-6 py-4">

                    <span className="text-sm font-bold text-gray-900">
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
                      className="inline-flex rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
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