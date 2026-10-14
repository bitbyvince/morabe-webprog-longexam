import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import Button from "../../components/Button";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () =>
    apiFetch("/orders")
      .then(setOrders)
      .catch((err) => setError(err.message));

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    setCancellingId(orderId);
    setError("");
    try {
      await apiFetch(`/orders/${orderId}/cancel`, { method: "POST" });
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId("");
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-amber-900">My Orders</h1>
      {error && <p className="mt-4 text-red-700">{error}</p>}
      <div className="mt-8 space-y-4">
        {orders.length === 0 && !error && <p>No orders yet.</p>}
        {orders.map((order) => (
          <article
            key={order._id}
            className="border-2 border-amber-900 bg-amber-50 p-5"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <strong>Order {order._id.slice(-6)}</strong>
              <span className="font-semibold capitalize text-amber-900">
                {order.orderStatus.replaceAll("_", " ")}
              </span>
            </div>
            <p className="mt-3 text-sm">
              {order.items
                ?.map(
                  (item) =>
                    `${item.product?.productName || "Product"} x${item.quantity}`,
                )
                .join(", ")}
            </p>
            <p className="mt-3 font-bold">Total: ₱{order.totalAmount}</p>
            {["processing", "confirmed"].includes(order.orderStatus) && (
              <Button
                type="button"
                className="mt-4"
                onClick={() => cancelOrder(order._id)}
                disabled={cancellingId === order._id}
              >
                {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
              </Button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default OrdersPage;
