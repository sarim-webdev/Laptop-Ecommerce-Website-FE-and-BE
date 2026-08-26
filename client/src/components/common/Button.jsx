import PropTypes from "prop-types";

/* =========================================
   BUTTON COMPONENT
========================================= */

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",

    secondary:
      "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500",

    outline:
      "border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-400",

    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",

    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthStyle}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden="true"
          />

          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

/* =========================================
   PROP TYPES
========================================= */

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "danger",
    "success",
    "ghost",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;