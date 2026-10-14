import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { apiFetch } from "../../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setNotFound(false);

    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((found) => {
        if (!found?._id) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setProduct(found);
        return fetch(`${API_URL}/reviews/product/${found._id}`)
          .then((res) => res.json())
          .then((reviewData) => setReviews(reviewData));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("Please sign in to add items to your cart.");
      return;
    }
    try {
      await apiFetch("/carts", {
        method: "POST",
        body: JSON.stringify({
          items: [{ product: product._id, quantity: 1, price: product.price }],
          totalPrice: product.price,
        }),
      });
      alert("Added to cart!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReview = async (event) => {
    event.preventDefault();
    try {
      await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({
          product: product._id,
          ...reviewForm,
          rating: Number(reviewForm.rating),
        }),
      });
      setReviewMessage("Review submitted.");
      setReviews(await apiFetch(`/reviews/product/${product._id}`));
      setReviewForm({ rating: 5, comment: "" });
    } catch (error) {
      setReviewMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <p className="text-sm text-gray-600">Loading product...</p>
        </section>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-amber-900">
              Product not found
            </h1>
            <Button to="/products" className="mt-6">
              Back to Products
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4">
            <Button to="/products">Back to Products</Button>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
            {product.category?.categoryName}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-amber-900 sm:text-4xl">
            {product.productName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-700">
            <span className="font-bold text-amber-900">₱{product.price}</span>
            <span>{product.quantity} in stock</span>
            <span className="capitalize">{product.condition}</span>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex aspect-4/3 items-center justify-center rounded-[1.25rem] border-2 border-amber-900 bg-gray-200 overflow-hidden">
            <img
              src={product.images?.[0]}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-sm max-w-none space-y-4 text-gray-700">
            <p className="text-base leading-7 text-gray-700 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <div className="mt-8 border-t-2 border-amber-900 pt-6">
            <Button
              variant="primary"
              className="mr-3"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button to="/products">Back to Products</Button>
          </div>

          <div className="mt-10 border-t-2 border-amber-900 pt-6">
            <h2 className="mb-4 text-xl font-semibold text-amber-900">
              Reviews
            </h2>
            {reviews.length === 0 && (
              <p className="text-sm text-gray-600">No reviews yet.</p>
            )}
            {reviews.map((r) => (
              <div key={r._id} className="mb-4 border-b border-amber-200 pb-4">
                <p className="text-sm font-semibold text-amber-900">
                  {r.user?.firstName} — {r.rating}★
                </p>
                <p className="text-sm text-gray-700">{r.comment}</p>
              </div>
            ))}
            {localStorage.getItem("user") && (
              <form onSubmit={handleReview} className="mt-6 space-y-3">
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, rating: e.target.value })
                  }
                  className="rounded-xl border border-amber-300 px-3 py-2"
                >
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  placeholder="Write a review"
                  className="w-full rounded-xl border border-amber-300 px-3 py-2"
                />
                <Button type="submit">Submit Review</Button>
                {reviewMessage && (
                  <p className="text-sm text-amber-800">{reviewMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
