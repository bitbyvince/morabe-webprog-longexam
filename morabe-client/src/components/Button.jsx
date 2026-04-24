import { Link } from "react-router-dom";

const variantClasses = {
  primary: "bg-amber-900 text-amber-50 hover:bg-amber-800",
  secondary: "bg-amber-50 text-amber-900 hover:bg-amber-100",
};

const Button = ({
  children,
  to,
  type = "button",
  variant = "secondary",
  className = "",
}) => {
  const classes = [
    "inline-flex items-center justify-center rounded-full border-2 border-amber-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition",
    variantClasses[variant] ?? variantClasses.secondary,
    className,
  ]
    .join(" ")
    .trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
};

export default Button;
