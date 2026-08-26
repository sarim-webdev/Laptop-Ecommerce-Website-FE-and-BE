import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import authService from "../../services/authService";
import Button from "../../components/common/Button";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================
     SUBMIT RESET PASSWORD
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* =========================================
       TOKEN CHECK
    ========================================= */

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    /* =========================================
       PASSWORD VALIDATION
    ========================================= */

    if (!password) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /* =========================================
       RESET PASSWORD
    ========================================= */

    try {
      setLoading(true);

      const response = await authService.resetPassword(token, {
        password,
        confirmPassword,
      });

      setSuccess(
        response?.message ||
          "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");

      /* =========================================
         REDIRECT TO SIGN IN
      ========================================= */

      setTimeout(() => {
        navigate("/sign-in");
      }, 1800);
    } catch (error) {
      console.error("Reset password error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to reset your password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-16 text-white sm:px-6 lg:px-8">

      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

      {/* =========================================
          CARD
      ========================================= */}

      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">

          {/* =========================================
              LOGO / HEADER
          ========================================= */}

          <div className="mb-8 text-center">

            <Link
              to="/"
              className="inline-block text-2xl font-black tracking-tight text-white transition hover:text-cyan-400"
            >
              NEXORA
              <span className="text-cyan-400">.</span>
            </Link>

            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <span className="text-2xl">🔐</span>
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
              Reset Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Create a new secure password for your NEXORA account.
            </p>

          </div>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400">
              {error}
            </div>
          )}

          {/* =========================================
              SUCCESS
          ========================================= */}

          {success && (
            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-400">
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

            {/* New Password */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.05]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-gray-600
                  focus:border-cyan-400/50
                  focus:bg-white/[0.07]
                  focus:ring-4
                  focus:ring-cyan-400/10
                "
              />

            </div>

            {/* Confirm Password */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.05]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-gray-600
                  focus:border-cyan-400/50
                  focus:bg-white/[0.07]
                  focus:ring-4
                  focus:ring-cyan-400/10
                "
              />

            </div>

            {/* Password Hint */}

            <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3">

              <span className="mt-0.5 text-cyan-400">
                •
              </span>

              <p className="text-xs leading-5 text-gray-500">
                Use at least 8 characters for your new password.
              </p>

            </div>

            {/* Submit */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

          </form>

          {/* =========================================
              SIGN IN
          ========================================= */}

          <div className="mt-7 text-center">

            <Link
              to="/sign-in"
              className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              ← Back to Sign In
            </Link>

          </div>

        </div>

        {/* Bottom Branding */}

        <p className="mt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} NEXORA. All rights reserved.
        </p>

      </div>

    </main>
  );
};

export default ResetPassword;
