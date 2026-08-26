import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";

const SignUp = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    register,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================
     REDIRECT
  ========================================= */

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =========================================
     AVATAR CHANGE
  ========================================= */

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setFormData((previous) => ({
      ...previous,
      avatar: file,
    }));

    setAvatarPreview(URL.createObjectURL(file));

    setError("");
    setSuccess("");
  };

  /* =========================================
     REMOVE AVATAR
  ========================================= */

  const handleRemoveAvatar = () => {
    setFormData((previous) => ({
      ...previous,
      avatar: null,
    }));

    setAvatarPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================
     REGISTER
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      /* =========================================
         VALIDATION
      ========================================= */

      if (formData.name.trim().length < 2) {
        setError("Name must be at least 2 characters long.");
        return;
      }

      if (!formData.phone.trim()) {
        setError("Phone number is required.");
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!formData.address.trim()) {
        setError("Address is required.");
        return;
      }

      if (!formData.city.trim()) {
        setError("City is required.");
        return;
      }

      if (!formData.state.trim()) {
        setError("State / Province is required.");
        return;
      }

      if (!formData.postalCode.trim()) {
        setError("Postal code is required.");
        return;
      }

      if (!formData.country.trim()) {
        setError("Country is required.");
        return;
      }

      /* =========================================
         FORMDATA
      ========================================= */

      const registrationData = new FormData();

      registrationData.append("name", formData.name.trim());
      registrationData.append("email", formData.email.trim());
      registrationData.append("phone", formData.phone.trim());
      registrationData.append("password", formData.password);
      registrationData.append(
        "confirmPassword",
        formData.confirmPassword
      );

      /*
        Address fields
      */

      registrationData.append(
        "address",
        formData.address.trim()
      );

      registrationData.append(
        "city",
        formData.city.trim()
      );

      registrationData.append(
        "state",
        formData.state.trim()
      );

      registrationData.append(
        "postalCode",
        formData.postalCode.trim()
      );

      registrationData.append(
        "country",
        formData.country.trim()
      );

      /*
        Avatar
      */

      if (formData.avatar) {
        registrationData.append(
          "avatar",
          formData.avatar
        );
      }

      /* =========================================
         API
      ========================================= */

      await register(registrationData);

      /* =========================================
         SUCCESS
      ========================================= */

      setSuccess(
        "Account created successfully. Redirecting..."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Pakistan",
        avatar: null,
      });

      setAvatarPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => {
        navigate("/sign-in", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.log("REGISTER ERROR:", error?.response?.data);

      const validationErrors =
        error?.response?.data?.errors;

      if (validationErrors?.length) {
        setError(
          validationErrors
            .map((item) => `${item.field}: ${item.message}`)
            .join(" | ")
        );
      } else {
        setError(
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to create your account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     AUTH LOADING
  ========================================= */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070a]">
        <Loader />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070a] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* =========================================
          PAGE CONTAINER
      ========================================= */}

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center">

        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#090c10] shadow-2xl shadow-black/50 lg:grid-cols-[0.85fr_1.15fr]">

          {/* =========================================
              LEFT BRAND PANEL
          ========================================= */}

          <section className="relative hidden overflow-hidden bg-[#070a0e] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">

            {/* Glow */}

            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/[0.08] blur-3xl" />

            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-600/[0.08] blur-3xl" />

            <div className="relative">

              {/* Logo */}

              <Link
                to="/"
                className="text-3xl font-black tracking-tight"
              >
                NEXORA
                <span className="text-cyan-400">.</span>
              </Link>

              <div className="mt-24">

                <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  NEXORA ACCOUNT
                </span>

                <h1 className="mt-6 max-w-lg text-4xl font-black leading-[1.08] tracking-tight xl:text-5xl">
                  Your technology.
                  <span className="block text-cyan-400">
                    Your experience.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-sm leading-7 text-gray-500">
                  Create your NEXORA account and enjoy a
                  smarter way to discover premium laptops,
                  manage your orders and personalize your
                  shopping experience.
                </p>

              </div>

            </div>

            {/* Bottom Info */}

            <div className="relative mt-16 border-t border-white/[0.07] pt-6">

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Premium Technology</span>
                <span>Secure Shopping</span>
                <span>Easy Tracking</span>
              </div>

            </div>

          </section>

          {/* =========================================
              FORM PANEL
          ========================================= */}

          <section className="p-5 sm:p-8 lg:p-10 xl:p-12">

            {/* Mobile Logo */}

            <div className="mb-8 lg:hidden">

              <Link
                to="/"
                className="text-2xl font-black tracking-tight"
              >
                NEXORA
                <span className="text-cyan-400">.</span>
              </Link>

            </div>

            <div className="mx-auto max-w-2xl">

              {/* Header */}

              <div className="mb-7">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Create your account
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Get started with NEXORA
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Enter your details below to create your account.
                </p>

              </div>

              {/* =========================================
                  ALERTS
              ========================================= */}

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 text-sm text-red-400">
                  <span className="mt-0.5">!</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5 text-sm text-emerald-400">
                  {success}
                </div>
              )}

              {/* =========================================
                  FORM
              ========================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-7"
              >

                {/* =========================================
                    PROFILE SECTION
                ========================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-400">
                      01
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">
                        Personal Information
                      </h3>

                      <p className="text-xs text-gray-600">
                        Basic account details
                      </p>
                    </div>

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* NAME */}

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-xs font-semibold text-gray-400"
                      >
                        Full Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Muhammad Sarim"
                        autoComplete="name"
                        required
                        className="form-input"
                      />
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-semibold text-gray-400"
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
                        className="form-input"
                      />
                    </div>

                    {/* PHONE */}

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-xs font-semibold text-gray-400"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03001234567"
                        autoComplete="tel"
                        required
                        className="form-input"
                      />
                    </div>

                  </div>

                </div>

                {/* =========================================
                    AVATAR
                ========================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-400">
                      02
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">
                        Profile Picture
                      </h3>

                      <p className="text-xs text-gray-600">
                        Optional
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                    {/* Avatar */}

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">

                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl text-gray-600">
                          👤
                        </span>
                      )}

                    </div>

                    <div className="min-w-0">

                      <label
                        htmlFor="avatar"
                        className="inline-flex cursor-pointer rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-xs font-bold text-cyan-400 transition hover:bg-cyan-400/15"
                      >
                        Choose Image
                      </label>

                      <input
                        ref={fileInputRef}
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />

                      <div className="mt-2 flex items-center gap-3">

                        <p className="text-[11px] text-gray-600">
                          JPG, PNG or WEBP • Max 5MB
                        </p>

                        {formData.avatar && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="text-[11px] font-semibold text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

                {/* =========================================
                    PASSWORD SECTION
                ========================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-400">
                      03
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">
                        Account Security
                      </h3>

                      <p className="text-xs text-gray-600">
                        Protect your account
                      </p>
                    </div>

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* PASSWORD */}

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-xs font-semibold text-gray-400"
                      >
                        Password
                      </label>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create password"
                        autoComplete="new-password"
                        required
                        className="form-input"
                      />
                    </div>

                    {/* CONFIRM */}

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-xs font-semibold text-gray-400"
                      >
                        Confirm Password
                      </label>

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        required
                        className="form-input"
                      />
                    </div>

                  </div>

                  <p className="mt-2 text-[11px] text-gray-600">
                    Password must contain at least 8 characters.
                  </p>

                </div>

                {/* =========================================
                    ADDRESS SECTION
                ========================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-400">
                      04
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">
                        Delivery Address
                      </h3>

                      <p className="text-xs text-gray-600">
                        Used for your future orders
                      </p>
                    </div>

                  </div>

                  <div className="space-y-4">

                    {/* ADDRESS */}

                    <div>
                      <label
                        htmlFor="address"
                        className="mb-2 block text-xs font-semibold text-gray-400"
                      >
                        Street Address
                      </label>

                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House 123, Street 5, Gulshan..."
                        rows={2}
                        required
                        className="form-input resize-none"
                      />
                    </div>

                    {/* CITY / STATE */}

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>
                        <label
                          htmlFor="city"
                          className="mb-2 block text-xs font-semibold text-gray-400"
                        >
                          City
                        </label>

                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Karachi"
                          required
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="state"
                          className="mb-2 block text-xs font-semibold text-gray-400"
                        >
                          State / Province
                        </label>

                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Sindh"
                          required
                          className="form-input"
                        />
                      </div>

                    </div>

                    {/* POSTAL / COUNTRY */}

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>
                        <label
                          htmlFor="postalCode"
                          className="mb-2 block text-xs font-semibold text-gray-400"
                        >
                          Postal Code
                        </label>

                        <input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="75300"
                          autoComplete="postal-code"
                          required
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="country"
                          className="mb-2 block text-xs font-semibold text-gray-400"
                        >
                          Country
                        </label>

                        <input
                          id="country"
                          name="country"
                          type="text"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Pakistan"
                          autoComplete="country-name"
                          required
                          className="form-input"
                        />
                      </div>

                    </div>

                  </div>

                </div>

                {/* =========================================
                    SUBMIT
                ========================================= */}

                <div className="pt-1">

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-cyan-400/10 transition duration-300 hover:bg-cyan-300 hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create NEXORA Account"}
                  </button>

                  <p className="mt-3 text-center text-[11px] leading-5 text-gray-600">
                    By creating an account, you agree to our
                    terms and shopping policies.
                  </p>

                </div>

              </form>

              {/* =========================================
                  SIGN IN
              ========================================= */}

              <div className="mt-7 border-t border-white/[0.07] pt-6">

                <p className="text-center text-sm text-gray-500">

                  Already have an account?{" "}

                  <Link
                    to="/sign-in"
                    className="font-bold text-cyan-400 transition hover:text-cyan-300"
                  >
                    Sign In
                  </Link>

                </p>

              </div>

            </div>

          </section>

        </div>

      </div>

      {/* =========================================
          GLOBAL FORM INPUT STYLE
      ========================================= */}

      <style>
        {`
          .form-input {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.025);
            padding: 0.8rem 0.95rem;
            font-size: 0.875rem;
            color: white;
            outline: none;
            transition: all 200ms ease;
          }

          .form-input::placeholder {
            color: rgb(75 85 99);
          }

          .form-input:hover {
            border-color: rgba(255,255,255,0.15);
          }

          .form-input:focus {
            border-color: rgba(34,211,238,0.55);
            background: rgba(255,255,255,0.04);
            box-shadow: 0 0 0 3px rgba(34,211,238,0.08);
          }
        `}
      </style>

    </main>
  );
};

export default SignUp;