import Button from "../components/Button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center bg-amber-50 py-12 sm:py-16">
      <section className="w-full border-y-2 border-amber-900 bg-white px-6 py-12 shadow-sm sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
            Error 404
          </p>
          <h1 className="text-5xl font-bold leading-tight text-amber-900 sm:text-6xl">
            Lost in Urban Feral? This page can't be found.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-700 sm:text-lg">
            The page you are looking for cannot be found. It may have moved,
            been renamed, or never existed. Let's get you back to the Urban
            Feral experience.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/">Return Home</Button>
            <Button to="/products" variant="secondary">
              Explore Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
