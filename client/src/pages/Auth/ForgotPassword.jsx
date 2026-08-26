import { useState } from "react";
import { Link } from "react-router-dom";

import authService from "../../services/authService";
import Button from "../../components/common/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================
     SUBMIT FORGOT PASSWORD
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.forgotPassword({
        email: email.trim(),
      });

      setSuccess(
        response?.message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05080d] px-4 py-16 text-white sm:px-6 lg:px-8">

      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.025] blur-3xl" />

      <div className="relative mx-auto w-full max-w-md">

        {/* =========================================
            CARD
        ========================================= */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1119]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">

          {/* Top Accent */}

          <div className="mx-auto mb-8 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />

          {/* =========================================
              LOGO / HEADER
          ========================================= */}

          <div className="mb-8 text-center">

            <Link
              to="/"
              className="inline-block text-2xl font-black tracking-tight text-white transition hover:text-cyan-400"
            >
              NEXORA<span className="text-cyan-400">.</span>
            </Link>

            <h1 className="mt-6 text-2xl font-black tracking-tight text-white">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Enter your email address and we'll send you a
              password reset link.
            </p>

          </div>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-400">
              {error}
            </div>
          )}

          {/* =========================================
              SUCCESS
          ========================================= */}

          {success && (
            <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-400">
              {success}
            </div>
          )}

          {/* =========================================
              FORM
          ========================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#070c12]
                  px-4
                  py-3
                  text-sm
                  text-white
                  placeholder:text-gray-600
                  outline-none
                  transition-all
                  duration-300
                  focus:border-cyan-400/60
                  focus:bg-[#0a1119]
                  focus:ring-4
                  focus:ring-cyan-400/10
                "
              />

            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </Button>

          </form>

          {/* =========================================
              BACK TO LOGIN
          ========================================= */}

          <div className="mt-7 text-center">

            <Link
              to="/sign-in"
              className="
                inline-flex
                items-center
                text-sm
                font-semibold
                text-gray-400
                transition-all
                duration-300
                hover:text-cyan-400
              "
            >
              ← Back to Sign In
            </Link>

          </div>

        </div>

        {/* =========================================
            FOOTER TEXT
        ========================================= */}

        <p className="mt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} NEXORA. All rights reserved.
        </p>

      </div>
    </main>
  );
};

export default ForgotPassword;