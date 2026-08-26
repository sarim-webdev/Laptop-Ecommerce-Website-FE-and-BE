import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     REDIRECT IF ALREADY LOGGED IN
  ========================================= */

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =========================================
     HANDLE LOGIN
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login(formData);

      const loggedInUser =
        response?.data?.user ||
        response?.user ||
        null;

      const redirectPath =
        location.state?.from?.pathname || "/";

      if (loggedInUser?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <Loader />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8">

      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

      {/* =========================================
          MAIN CONTAINER
      ========================================= */}

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">

        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-[#080b0f]/90 shadow-2xl shadow-black/50 backdrop-blur-xl lg:grid-cols-2">

          {/* =========================================
              LEFT SIDE
          ========================================= */}

          <div className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#0b1117] via-[#080b0f] to-black p-12 lg:flex lg:flex-col lg:justify-center">

            {/* Decorative Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative max-w-md">

              {/* Brand */}

              <Link
                to="/"
                className="inline-block text-3xl font-black tracking-tight text-white"
              >
                NEXORA
                <span className="text-cyan-400">.</span>
              </Link>

              {/* Label */}

              <p className="mt-10 text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                Welcome Back
              </p>

              {/* Heading */}

              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">
                Power your world
                <span className="block text-cyan-400">
                  with NEXORA.
                </span>
              </h1>

              {/* Description */}

              <p className="mt-6 max-w-lg text-base leading-7 text-gray-400">
                Sign in to manage your account, explore premium
                laptops, track your orders, and enjoy a seamless
                shopping experience.
              </p>

              {/* FEATURES */}

              <div className="mt-9 space-y-4">

                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                    ✓
                  </span>
                  Premium laptops
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                    ✓
                  </span>
                  Secure checkout
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                    ✓
                  </span>
                  Fast delivery
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                    ✓
                  </span>
                  Dedicated customer support
                </div>

              </div>

            </div>
          </div>

          {/* =========================================
              FORM SIDE
          ========================================= */}

          <div className="relative p-6 sm:p-10 lg:p-12 xl:p-14">

            {/* Mobile Logo */}

            <div className="mb-8 lg:hidden">

              <Link
                to="/"
                className="text-2xl font-black tracking-tight text-white"
              >
                NEXORA
                <span className="text-cyan-400">.</span>
              </Link>

            </div>

            <div className="mx-auto max-w-md">

              {/* HEADER */}

              <div className="mb-8">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                  NEXORA ACCOUNT
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                  Sign In
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Enter your account details to continue.
                </p>

              </div>

              {/* =========================================
                  ERROR
              ========================================= */}

              {error && (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400">
                  {error}
                </div>
              )}

              {/* =========================================
                  FORM
              ========================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-300"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-gray-600
                      hover:border-white/20
                      focus:border-cyan-400/60
                      focus:bg-white/[0.06]
                      focus:ring-4
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-300"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-gray-600
                      hover:border-white/20
                      focus:border-cyan-400/60
                      focus:bg-white/[0.06]
                      focus:ring-4
                      focus:ring-cyan-400/10
                    "
                  />

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-2
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-400
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-black
                    shadow-lg
                    shadow-cyan-400/10
                    transition-all
                    duration-300
                    hover:bg-cyan-300
                    hover:shadow-cyan-400/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

              </form>

              {/* =========================================
                  DIVIDER
              ========================================= */}

              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-gray-600">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              {/* SIGN UP */}

              <p className="text-center text-sm text-gray-500">

                Don't have an account?{" "}

                <Link
                  to="/sign-up"
                  className="font-bold text-cyan-400 transition hover:text-cyan-300"
                >
                  Create an account
                </Link>

              </p>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default SignIn;
