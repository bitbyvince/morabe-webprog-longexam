import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../services/AuthService";

const inputClasses =
  "mt-2 w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 outline-none transition placeholder:text-amber-400 focus:border-amber-900 focus:bg-white";

const actionButtonClassName =
  "w-full rounded-xl py-3 text-[11px] tracking-[0.2em]";

const SignUpPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
        Sign Up
      </h1>
      <p className="mt-3 text-sm leading-6 text-gray-700">
        Create a store account for faster checkout, order updates, and pickup
        details.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="text-sm font-medium text-amber-800"
            >
              First Name
            </label>
            <input
              id="first-name"
              name="firstName"
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              className={inputClasses}
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="text-sm font-medium text-amber-800"
            >
              Last Name
            </label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              placeholder="Last name"
              autoComplete="family-name"
              className={inputClasses}
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="text-sm font-medium text-amber-800"
          >
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            className={inputClasses}
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="text-sm font-medium text-amber-800"
          >
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className={inputClasses}
            value={form.password}
            onChange={handleChange}
            required
          />
          <p className="mt-2 text-xs leading-5 text-amber-700">
            Use a secure password with letters, numbers, and symbols.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          className={actionButtonClassName}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            className={actionButtonClassName}
          >
            Sign Up with Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={actionButtonClassName}
          >
            Sign Up with Apple
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-amber-200 pt-6 text-sm text-gray-700">
        Already have an account?{" "}
        <Link
          to="/auth/signin"
          className="font-semibold text-amber-900 transition hover:text-amber-700"
        >
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
