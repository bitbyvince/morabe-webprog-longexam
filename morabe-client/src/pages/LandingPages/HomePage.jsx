import Button from "../../components/Button";
import banner from "../../assets/img/banner.jpg";
import daily from "../../assets/img/daily.jpg";
import casual from "../../assets/img/casual.jpg";
import summer from "../../assets/img/summer.jpg";

const HomePage = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <section className="relative min-h-[28rem] overflow-hidden border-y-2 border-amber-900 bg-amber-900 px-4 py-10 sm:px-6 lg:px-8">
        <img
          src={banner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-amber-900/45" />

        <div className="relative z-10 flex min-h-[22rem] items-start justify-end text-right sm:min-h-[24rem]">
          <div className="max-w-xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200"></p>
            <h1 className="text-3xl font-bold leading-tight text-amber-50 sm:text-4xl">
              Welcome to URBAN FERAL
            </h1>
            <p className="mt-4 text-sm leading-7 text-amber-100 sm:text-base">
              Discover your style. Wear your identity. Stand out with every
              piece.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button to="/products">Shop Now</Button>
              <Button to="/about" variant="primary">
                About Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
            Store Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-amber-900">
            Quick shopping blocks
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-2xl font-bold text-amber-900">08</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Products
            </p>
          </div>
          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-2xl font-bold text-amber-900">06</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Categories
            </p>
          </div>
          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-2xl font-bold text-amber-900">24</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Orders
            </p>
          </div>
          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-2xl font-bold text-amber-900">03</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Pickup Slots
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
            Shop Sections
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-amber-900">
            Simple store cards
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-4">
            <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-gray-200">
              <img
                src={daily}
                alt="Daily Essentials"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-amber-900">
              Daily Essentials
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              T-shirts, Jackets, and Jeans.
            </p>
            <Button to="/products" className="mt-4" variant="primary">
              View Products
            </Button>
          </article>

          <article className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-4">
            <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-gray-200">
              <img
                src={casual}
                alt="Casual Wear"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-amber-900">
              Casual
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Comfortable pieces for class days, commute days, and weekends.
            </p>
            <Button to="/products" className="mt-4" variant="primary">
              Shop Casual
            </Button>
          </article>

          <article className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-4">
            <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-gray-200">
              <img
                src={summer}
                alt="Summer Collection"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-amber-900">
              Summer Collection
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Lightweight and breathable options for hot weather.
            </p>
            <Button to="/products" className="mt-4" variant="primary">
              View Summer Collection
            </Button>
          </article>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
