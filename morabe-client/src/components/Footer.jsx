import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t-2 border-amber-900 bg-amber-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <p className="text-lg font-bold text-amber-50">URBAN FERAL</p>
              <p className="mt-1 text-sm text-amber-100">
                Premium men's fashion & essentials.
              </p>
            </div>
            <p className="text-xs text-amber-100 leading-relaxed">
              Your go-to destination for quality men's apparel and style
              essentials. Crafting sophisticated fashion for the modern man.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
              Quick Links
            </h3>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                About
              </Link>
              <Link
                to="/products"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                Products
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
              Support
            </h3>
            <nav className="space-y-2">
              <Link
                to="/auth/signin"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                Sign Up
              </Link>
              <a
                href="mailto:support@urbauferal.com"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
              Connect
            </h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                Instagram
              </a>
              <a
                href="#"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                Facebook
              </a>
              <a
                href="#"
                className="block text-sm text-amber-100 hover:text-white transition"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-amber-800 pt-6">
          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-amber-200">
              © 2024 URBAN FERAL. All rights reserved.
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-200">
              Products | Cart | Pickup
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
