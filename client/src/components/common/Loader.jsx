import PropTypes from "prop-types";

/* =========================================
   LOADER COMPONENT
========================================= */

const Loader = ({
  size = "md",
  text = "",
  fullScreen = false,
}) => {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  const containerStyle = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    : "flex items-center justify-center";

  return (
    <div
      className={containerStyle}
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <div
          className={`
            ${sizes[size]}
            animate-spin
            rounded-full
            border-gray-200
            border-t-blue-600
          `}
        />

        {text && (
          <p className="text-sm font-medium text-gray-600">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

/* =========================================
   PROP TYPES
========================================= */

Loader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default Loader;