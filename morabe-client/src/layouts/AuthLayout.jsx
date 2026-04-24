import { Outlet } from "react-router-dom";
import logo from "../assets/img/logo.png";

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-amber-50 text-amber-900">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">
        <div className="flex items-center justify-center border-b-2 border-amber-200 bg-amber-100 p-8 sm:p-10 lg:border-b-0 lg:border-r-2 lg:border-amber-200 lg:p-16">
          <img
            src={logo}
            alt="URBAN FERAL"
            className="h-150 w-150 rounded-full border-2 border-amber-900 bg-amber-50 object-contain"
          />
        </div>

        <main className="flex items-center bg-amber-50 px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;
