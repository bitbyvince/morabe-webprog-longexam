import { NavLink } from "react-router-dom";
import logo from "../assets/img/logo.png";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
];

const navLinkClassName = ({ isActive }) =>
  [
    "rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition",
    isActive
      ? "border-amber-900 bg-amber-900 text-amber-50"
      : "border-transparent text-gray-600 hover:border-amber-900 hover:bg-amber-50 hover:text-amber-900",
  ].join(" ");

const authLinkClassName =
  "rounded-full border-2 border-amber-900 bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-900 transition hover:bg-amber-900 hover:text-amber-50";

const NavBar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-amber-900 bg-amber-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="BulldogEx"
            className="h-9 w-9 rounded-full border-2 border-amber-900 bg-amber-50 object-contain"
          />
          <div className="space-y-0.5">
            <p className="text-xl font-bold text-amber-900">URBAN FERAL</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={navLinkClassName}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to="/auth/signin" className={authLinkClassName}>
            Sign In
          </NavLink>
          <NavLink to="/auth/signup" className={authLinkClassName}>
            Sign Up
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
