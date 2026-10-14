import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { apiFetch } from "../../services/api";

const statuses = [
  "processing",
  "confirmed",
  "ready_for_claiming",
  "shipped",
  "delivered",
  "cancelled",
];



const navTabClassName = (isActive) =>
  [
    "rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition",
    isActive
      ? "border-amber-900 bg-amber-900 text-amber-50"
      : "border-transparent text-gray-600 hover:border-amber-900 hover:bg-amber-50 hover:text-amber-900",
  ].join(" ");

const AdminPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [createImagePreview, setCreateImagePreview] = useState("");
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    quantity: 1,
    condition: "new",
    imageFile: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    ...(currentUser.role === "admin"
      ? [
          { id: "reviews", label: "Reviews" },
          { id: "users", label: "Users" },
        ]
      : []),
  ];

  const load = async () => {
    try {
      const [orderData, productData, categoryData] = await Promise.all([
        apiFetch("/orders"),
        apiFetch("/products?limit=100"),
        apiFetch("/categories"),
      ]);
      setOrders(orderData);
      setProducts(productData.data || []);
      setCategories(categoryData);
      if (currentUser.role === "admin") {
        setUsers(await apiFetch("/users"));
        setReviews(await apiFetch("/reviews"));
      }
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrder = async (id, orderStatus) => {
    await apiFetch(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ orderStatus }),
    });
    setMessage("Order status updated.");
    load();
  };
  const updateUser = async (id, isActive) => {
    await apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ isActive }),
    });
    setMessage("User status updated.");
    load();
  };

  const handleCreateImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setForm((previous) => ({ ...previous, imageFile: file }));
    setCreateImagePreview(URL.createObjectURL(file));
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setEditProduct((previous) => ({
      ...previous,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };
  
  const createProduct = async (event) => {
    event.preventDefault();
    try {
      if (!form.imageFile) {
        setError("Choose a product image before creating the product.");
        return;
      }

      const body = new FormData();
      body.append("productName", form.productName);
      body.append("description", form.description);
      body.append("price", form.price);
      body.append("category", form.category);
      body.append("quantity", String(form.quantity));
      body.append("condition", form.condition);
      body.append("seller", currentUser._id);
      body.append("image", form.imageFile);

      await apiFetch("/products", {
        method: "POST",
        body,
      });
      setForm({
        productName: "",
        description: "",
        price: "",
        category: "",
        quantity: 1,
        condition: "new",
        imageFile: null,
      });
      setCreateImagePreview("");
      setMessage("Product created.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  

  const saveProduct = async (event) => {
    event.preventDefault();
    try {
      const body = new FormData();
      body.append("productName", editProduct.productName);
      body.append("description", editProduct.description);
      body.append("price", String(editProduct.price));
      body.append("quantity", String(editProduct.quantity));
      body.append("category", editProduct.category);
      body.append("condition", editProduct.condition);

      if (editProduct.imageFile) {
        body.append("image", editProduct.imageFile);
      }

      await apiFetch(`/products/${editProduct._id}`, {
        method: "PUT",
        body,
      });
      setEditProduct(null);
      setMessage("Product updated.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const saveReview = async (review) => {
    try {
      await apiFetch(`/reviews/${review._id}`, {
        method: "PUT",
        body: JSON.stringify({
          rating: Number(review.rating),
          comment: review.comment,
        }),
      });
      setMessage("Review updated.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl text-amber-900">
          {currentUser.role === "admin" ? "Admin" : "Provider"} Dashboard
        </h1>
        <p className="mt-2">Manage products, orders, and account access.</p>
      </div>
      {message && <p className="text-green-700">{message}</p>}
      {error && <p className="text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2 border-b-2 border-amber-900 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={navTabClassName(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "products" && (
        <>
          <form
            onSubmit={createProduct}
            className="space-y-3 border-2 border-amber-900 bg-amber-50 p-5"
          >
            <h2 className="text-xl text-amber-900">Create Product</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Product name"
                value={form.productName}
                onChange={(e) =>
                  setForm({ ...form, productName: e.target.value })
                }
                className="rounded-xl border border-amber-300 px-3 py-2"
              />
              <input
                required
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="rounded-xl border border-amber-300 px-3 py-2"
              />
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-xl border border-amber-300 px-3 py-2"
              >
                <option value="">Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <div>
                <label
                  htmlFor="create-product-image"
                  className="mb-1 block text-sm font-semibold text-amber-900"
                >
                  Product image (JPEG, PNG, or WebP; max 5 MB)
                </label>
                <input
                  id="create-product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={handleCreateImageChange}
                  className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2"
                />
              </div>
              {createImagePreview && (
                <img
                  src={createImagePreview}
                  alt="Preview of the product image to upload"
                  className="h-48 w-48 rounded-xl border border-amber-300 object-cover"
                />
              )}
            </div>
            <textarea
              required
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-xl border border-amber-300 px-3 py-2"
            />
            <Button type="submit" variant="primary">
              Create Product
            </Button>
          </form>
          <div>
            <h2 className="text-2xl text-amber-900">
              Products ({products.length})
            </h2>
            <div className="mt-4 space-y-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 py-3"
                >
                  <span>
                    {product.productName} · ₱{product.price}
                  </span>
                  <Button
                    onClick={() =>
                      setEditProduct({
                        _id: product._id,
                        productName: product.productName,
                        description: product.description || "",
                        price: product.price,
                        quantity: product.quantity,
                        category:
                          product.category?._id || product.category || "",
                        condition: product.condition || "new",
                        existingImage: product.images?.[0] || "",
                        imageFile: null,
                        imagePreview: "",
                      })
                    }
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
            {editProduct && (
              <form
                onSubmit={saveProduct}
                className="mt-4 space-y-3 border border-amber-300 p-4"
              >
                <input
                  value={editProduct.productName}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      productName: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-amber-300 px-3 py-2"
                />
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                  className="w-full rounded-xl border border-amber-300 px-3 py-2"
                />
                <input
                  type="number"
                  value={editProduct.quantity}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, quantity: e.target.value })
                  }
                  className="w-full rounded-xl border border-amber-300 px-3 py-2"
                />
                <div>
                  <p className="mb-2 text-sm font-semibold text-amber-900">
                    {editProduct.imageFile
                      ? "New image preview"
                      : "Current product image"}
                  </p>

                  {editProduct.imagePreview || editProduct.existingImage ? (
                    <img
                      src={
                        editProduct.imagePreview || editProduct.existingImage
                      }
                      alt={`Preview for ${editProduct.productName}`}
                      className="mb-3 h-48 w-48 rounded-xl border border-amber-300 object-cover"
                    />
                  ) : (
                    <p className="mb-3 text-sm text-gray-600">
                      No image saved for this product.
                    </p>
                  )}

                  <label
                    htmlFor="edit-product-image"
                    className="mb-1 block text-sm font-semibold text-amber-900"
                  >
                    Choose a replacement image (optional; JPEG, PNG, or WebP,
                    max 5 MB)
                  </label>
                  <input
                    id="edit-product-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleEditImageChange}
                    className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2"
                  />
                </div>
                <Button type="submit" variant="primary">
                  Save Product
                </Button>
              </form>
            )}
          </div>
        </>
      )}
      {activeTab === "orders" && (
        <div>
          <div>
            <h2 className="text-2xl text-amber-900">Orders</h2>
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-amber-900">
                      #{order._id.slice(-6)} · ₱{order.totalAmount}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      Buyer: {order.user?.firstName} {order.user?.lastName}
                      {order.user?.email && ` · ${order.user.email}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      Shipping address: {order.shippingAddress}
                    </p>
                  </div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrder(order._id, e.target.value)}
                    className="rounded-xl border border-amber-300 px-3 py-2"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === "users" && currentUser.role === "admin" && (
        <div>
          <h2 className="text-2xl text-amber-900">Users</h2>
          <div className="mt-4 space-y-3">
            {users.map((account) => (
              <div
                key={account._id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 py-3"
              >
                <span>
                  {account.firstName} {account.lastName} · {account.role}
                </span>
                <Button
                  onClick={() =>
                    updateUser(account._id, account.isActive === false)
                  }
                >
                  {account.isActive === false ? "Activate" : "Deactivate"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "reviews" && currentUser.role === "admin" && (
        <div>
          <h2 className="text-2xl text-amber-900">Reviews</h2>
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-amber-200 py-3">
                <p>
                  {review.product?.productName} by {review.user?.firstName}
                </p>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={review.rating}
                  onChange={(e) =>
                    setReviews(
                      reviews.map((item) =>
                        item._id === review._id
                          ? { ...item, rating: e.target.value }
                          : item,
                      ),
                    )
                  }
                  className="mt-2 w-20 rounded-xl border border-amber-300 px-3 py-2"
                />
                <textarea
                  value={review.comment}
                  onChange={(e) =>
                    setReviews(
                      reviews.map((item) =>
                        item._id === review._id
                          ? { ...item, comment: e.target.value }
                          : item,
                      ),
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-amber-300 px-3 py-2"
                />
                <Button onClick={() => saveReview(review)}>Save Review</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPage;
