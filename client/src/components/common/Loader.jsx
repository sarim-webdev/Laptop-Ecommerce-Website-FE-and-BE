
import PropTypes from "prop-types";

/* =========================================
   PREMIUM NEXORA LOADER
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

  if (fullScreen) {
    return (
      <div
        className="
          fixed inset-0 z-[9999]
          flex items-center justify-center
          overflow-hidden
          bg-[#0B1220]
          text-white
        "
        role="status"
        aria-label="Loading"
      >

        {/* Background Glow */}

        <div
          className="
            absolute -left-32 -top-32
            h-96 w-96 rounded-full
            bg-sky-400/10 blur-[120px]
            animate-pulse
          "
        />

        <div
          className="
            absolute -bottom-32 -right-32
            h-96 w-96 rounded-full
            bg-blue-500/10 blur-[120px]
            animate-pulse
          "
        />

        {/* Main Content */}

        <div className="relative z-10 flex flex-col items-center">

          {/* Animated Logo */}

          <div className="relative flex h-32 w-32 items-center justify-center">

            <div
              className="
                absolute inset-0
                rounded-full
                border-2 border-transparent
                border-t-sky-400
                border-r-sky-400/30
                animate-spin
              "
            />

            <div
              className="
                absolute inset-3
                rounded-full
                border border-transparent
                border-b-blue-500
                border-l-blue-500/30
                animate-[spin_3s_linear_infinite_reverse]
              "
            />

            <div
              className="
                flex h-20 w-20
                items-center justify-center
                rounded-2xl
                border border-sky-400/30
                bg-[#111C2E]
                shadow-[0_0_40px_rgba(56,189,248,0.15)]
                animate-pulse
              "
            >
              <span
                className="
                  text-5xl font-black
                  text-sky-400
                  drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]
                "
              >
                N
              </span>
            </div>

          </div>

          {/* Brand Name */}

          <div className="mt-8 text-center">

            <h1 className="text-3xl font-black tracking-[0.2em] text-white">
              NEXORA<span className="text-sky-400">.</span>
            </h1>

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">
              Premium Technology Experience
            </p>

          </div>

          {/* Loading Progress */}

          <div className="mt-12 w-60">

            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#263449]">

              <div
                className="
                  h-full w-2/5
                  rounded-full
                  bg-gradient-to-r from-sky-400 to-blue-500
                  shadow-[0_0_15px_rgba(56,189,248,0.7)]
                  animate-[loaderProgress_1.5s_ease-in-out_infinite]
                "
              />

            </div>

            <div className="mt-4 flex items-center justify-between">

              <p className="text-xs text-slate-400">
                {text || "Preparing your experience..."}
              </p>

              <span className="text-[10px] font-bold tracking-widest text-sky-400 animate-pulse">
                LOADING
              </span>

            </div>

          </div>

        </div>

        {/* Bottom Branding */}

        <p className="absolute bottom-8 text-[9px] font-bold tracking-[0.3em] text-slate-600">
          POWERED BY NEXORA
        </p>

        {/* Progress Animation */}

        <style>
          {`
            @keyframes loaderProgress {
              0% {
                transform: translateX(-110%);
              }
              100% {
                transform: translateX(260%);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-spin,
              .animate-pulse,
              [class*="animate-["] {
                animation: none !important;
              }
            }
          `}
        </style>

      </div>
    );
  }

  /* =========================================
     NORMAL INLINE LOADER
  ========================================= */

  return (
    <div
      className="flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center justify-center gap-3">

        <div
          className={`
            ${sizes[size]}
            animate-spin
            rounded-full
            border-[#263449]
            border-t-sky-400
          `}
        />

        {text && (
          <p className="text-sm font-medium text-slate-300">
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
