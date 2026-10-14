import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { apiFetch } from "../../services/api";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_pickup");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const loadCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return apiFetch(`/carts/user/${user._id}`)
      .then((data) => {
        setCart(data);
        setSelectedItems(data.items.map((item) => item.product._id));
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const selectedCartItems =
    cart?.items?.filter((item) => selectedItems.includes(item.product._id)) ||
    [];
  const selectedTotal = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const toggleItem = (productId) => {
    setSelectedItems((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const removeItem = async (productId) => {
    setError("");
    try {
      const remainingItems = cart.items
        .filter((item) => item.product._id !== productId)
        .map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
        }));
      await apiFetch(`/carts/${cart._id}`, {
        method: "PUT",
        body: JSON.stringify({
          items: remainingItems,
          totalPrice: remainingItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
        }),
      });
      setMessage("Item removed from cart.");
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const checkout = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: selectedCartItems.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: selectedTotal,
          shippingAddress: address,
          paymentMethod,
        }),
      });
      setMessage("Order placed successfully.");
      setTimeout(() => navigate("/orders"), 500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-amber-900">Your Cart</h1>
      {error && <p className="mt-4 text-red-700">{error}</p>}
      {message && <p className="mt-4 text-green-700">{message}</p>}
      {!cart?.items?.length ? (
        <p className="mt-8">
          Your cart is empty.{" "}
          <Link className="font-semibold text-amber-900" to="/products">
            Browse products.
          </Link>
        </p>
      ) : (
        <form onSubmit={checkout} className="mt-8 space-y-6">
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 border-b border-amber-200 py-3"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.product._id)}
                  onChange={() => toggleItem(item.product._id)}
                  className="h-4 w-4 accent-amber-900"
                  aria-label={`Select ${item.product.productName}`}
                />
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.productName}
                  className="h-20 w-20 rounded-xl border border-amber-900 bg-gray-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-amber-900">
                    {item.product.productName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <strong>₱{item.price * item.quantity}</strong>
                <Button
                  type="button"
                  onClick={() => removeItem(item.product._id)}
                  className="shrink-0"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xl font-bold text-amber-900">
            Selected total: ₱{selectedTotal}
          </p>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Pickup or delivery address"
            className="w-full rounded-xl border border-amber-300 px-4 py-3"
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-xl border border-amber-300 px-4 py-3"
          >
            <option value="cash_on_pickup">Cash on pickup</option>
            <option value="online">Online payment</option>
          </select>
          <Button
            type="submit"
            variant="primary"
            disabled={selectedCartItems.length === 0}
          >
            Place Order
          </Button>
        </form>
      )}
    </section>
  );
};

export default CartPage;
