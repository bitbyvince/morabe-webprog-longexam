import Button from "../../components/Button";
import logo from "../../assets/img/banner.jpg";
import blazer from "../../assets/img/blazer.jpg";
import hoodie from "../../assets/img/hoodie.jpg";
import pants from "../../assets/img/pants.jpg";
import tshirt from "../../assets/img/tshirt.jpg";

const AboutPage = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-amber-100 p-6">
            <div className="flex min-h-72 items-center justify-center rounded-[1.25rem] bg-gray-200">
              <img
                src={logo}
                alt="URBAN FERAL"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
              About Store
            </p>
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-amber-900 sm:text-4xl">
              Urban Feral is a streetwear brand focused on bold identity and
              effortless style.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-700 sm:text-base">
              It keeps a clean, minimal layout while showcasing raw aesthetics,
              strong visuals, and easy browsing. With clear collections, quick
              access to drops, and a gritty brand presence, Urban Feral delivers
              fashion built for the wild.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/" variant="primary">
                Back Home
              </Button>
              <Button to="/products">Open Products</Button>
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
            Quick store blocks
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-2xl font-bold text-amber-900">08</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Items
            </p>
          </div>
          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-2xl font-bold text-amber-900">06</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Categories
            </p>
          </div>
          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-2xl font-bold text-amber-900">03</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Pickup Slots
            </p>
          </div>
          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-2xl font-bold text-amber-900">24</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Orders
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-amber-900 bg-amber-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
              Store Flow
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-amber-900">
              Stacked shopping wireframe
            </h2>

            <div className="mt-6 space-y-4">
              <article className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
                <h3 className="text-lg font-semibold text-amber-900">
                  Curated Catalog
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  Products are grouped by daily need so shoppers can scan
                  faster.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
                <h3 className="text-lg font-semibold text-amber-900">
                  Simple Checkout
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  Product pages keep price, stock, and action buttons easy to
                  find.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
                <h3 className="text-lg font-semibold text-amber-900">
                  Pickup Ready
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  Store information stays direct for students who need quick
                  order updates.
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-amber-900 bg-amber-100 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
              Category Grid
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-gray-200">
                <img
                  src={blazer}
                  alt="Blazer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-gray-200">
                <img
                  src={hoodie}
                  alt="Hoodie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-gray-200">
                <img
                  src={tshirt}
                  alt="T-Shirt"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-gray-200">
                <img
                  src={pants}
                  alt="Pants"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <Button to="/products" className="mt-5">
              View Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
