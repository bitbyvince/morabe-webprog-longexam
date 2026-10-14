import { useState, useEffect } from "react";
import Button from "../../components/Button.jsx";
import ProductList from "../../components/ProductList.jsx";

const API_URL = "http://localhost:8000/api";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);

    fetch(`${API_URL}/v1/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products. Please try again.");
        setLoading(false);
      });
  }, [search, category]);

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
          Products
        </p>
        <h1 className="max-w-xl text-3xl font-bold leading-tight text-amber-900 sm:text-4xl">
          Shop streetwear essentials in a clean product grid.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-gray-700 sm:text-base">
          Browse bold pieces for everyday wear, city movement, and raw urban
          expression.
        </p>
        <div className="mt-6">
          <Button to="/">Back Home</Button>
        </div>
      </section>

      <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
              Featured Products
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-amber-900">
              Product card grid
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm text-amber-900 outline-none focus:border-amber-900"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm text-amber-900 outline-none focus:border-amber-900"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-gray-600">Loading products...</p>
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-sm text-gray-600">No products found.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductList products={products} />
        )}
      </section>
    </div>
  );
};

export default ProductListPage;
