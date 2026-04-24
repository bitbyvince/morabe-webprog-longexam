import Button from "../../components/Button.jsx";
import ProductList from "../../components/ProductList.jsx";
import products from "../../assets/product-content.js";

const ProductListPage = () => {
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
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
            Featured Products
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-amber-900">
            Product card grid
          </h2>
        </div>

        <ProductList products={products} />
      </section>
    </div>
  );
};

export default ProductListPage;
