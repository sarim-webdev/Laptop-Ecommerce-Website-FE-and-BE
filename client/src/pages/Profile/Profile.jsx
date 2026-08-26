import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import userService from "../../services/userService";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

/* =========================================
   PROFILE PAGE
========================================= */

const Profile = () => {
  const {
    user,
    loading: authLoading,
    refreshUser,
  } = useAuth();

  const fileInputRef = useRef(null);

  /* =========================================
     FORM DATA
  ========================================= */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  /* =========================================
     PASSWORD DATA
  ========================================= */

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =========================================
     LOADING STATES
  ========================================= */

  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  /* =========================================
     PROFILE MESSAGES
  ========================================= */

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================
     PASSWORD MESSAGES
  ========================================= */

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  /* =========================================
     LOAD USER DATA
  ========================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address:
        user.addresses?.[0]?.address || "",
    });
  }, [user]);

  /* =========================================
     INPUT HANDLER
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
     PASSWORD INPUT HANDLER
  ========================================= */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccess("");
  };

  /* =========================================
     UPDATE PROFILE
  ========================================= */

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const response =
        await userService.updateProfile({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        });

      await refreshUser();

      setSuccess(
        response?.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     OPEN FILE SELECTOR
  ========================================= */

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  /* =========================================
     UPLOAD AVATAR
  ========================================= */

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /* =========================================
       BASIC CLIENT-SIDE VALIDATION
    ========================================= */

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid image type. Please select JPG, JPEG, PNG or WEBP."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setAvatarLoading(true);
      setError("");
      setSuccess("");

      const avatarFormData = new FormData();

      avatarFormData.append("avatar", file);

      const response =
        await userService.uploadAvatar(
          avatarFormData
        );

      await refreshUser();

      setSuccess(
        response?.message ||
          "Profile photo updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to upload avatar:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to upload profile photo."
      );
    } finally {
      setAvatarLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* =========================================
     DELETE AVATAR
  ========================================= */

  const handleDeleteAvatar = async () => {
    try {
      setAvatarLoading(true);
      setError("");
      setSuccess("");

      const response =
        await userService.deleteAvatar();

      await refreshUser();

      setSuccess(
        response?.message ||
          "Profile photo removed successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete avatar:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to remove profile photo."
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  /* =========================================
     CHANGE PASSWORD
  ========================================= */

  const handleChangePassword = async (
    event
  ) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );

      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );

      return;
    }

    if (
      passwordData.newPassword.length < 8
    ) {
      setPasswordError(
        "New password must be at least 8 characters."
      );

      return;
    }

    try {
      setPasswordSaving(true);

      const response =
        await userService.changePassword({
          currentPassword:
            passwordData.currentPassword,

          newPassword:
            passwordData.newPassword,
        });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccess(
        response?.message ||
          "Password changed successfully."
      );
    } catch (err) {
      console.error(
        "Failed to change password:",
        err
      );

      setPasswordError(
        err?.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  /* =========================================
     AUTH LOADING
  ========================================= */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05080d]">
        <Loader />
      </main>
    );
  }

  /* =========================================
     NO USER
  ========================================= */

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05080d] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1119] p-8 text-center shadow-2xl shadow-black/30">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-400">
            👤
          </div>

          <h1 className="mt-6 text-2xl font-black text-white">
            Please Sign In
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            You need to sign in to access your
            NEXORA profile.
          </p>

          <Link
            to="/sign-in"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:bg-cyan-300"
          >
            Sign In
          </Link>

        </div>
      </main>
    );
  }

  /* =========================================
     CORRECT AVATAR URL
  ========================================= */

  const avatar =
    typeof user.avatar === "string"
      ? user.avatar
      : user.avatar?.url || "";

  /* =========================================
     INITIALS
  ========================================= */

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="min-h-screen bg-[#05080d] text-white">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05080d] px-4 py-16 sm:px-6 lg:px-8">

        {/* Background Glows */}

        <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <span className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                NEXORA Account
              </span>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                My Profile
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Manage your personal information,
                profile photo, and account security
                from one place.
              </p>

            </div>

            <Link
              to="/products"
              className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400 hover:text-black"
            >
              Continue Shopping →
            </Link>

          </div>

        </div>

      </section>

      {/* =========================================
          CONTENT
      ========================================= */}

      <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        {/* Background Glows */}

        <div className="pointer-events-none absolute left-1/4 top-20 h-72 w-72 rounded-full bg-cyan-500/[0.03] blur-3xl" />

        <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-blue-600/[0.03] blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          {/* =====================================
              GLOBAL SUCCESS
          ===================================== */}

          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-400">
              {success}
            </div>
          )}

          {/* =====================================
              GLOBAL ERROR
          ===================================== */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">

            {/* ===================================
                PROFILE CARD
            =================================== */}

            <div className="relative h-fit overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-6 shadow-2xl shadow-black/30 sm:p-8">

              {/* Card Glow */}

              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative">

                <div className="text-center">

                  {/* Avatar */}

                  <div className="relative mx-auto h-32 w-32">

                    {avatar ? (
                      <img
                        src={avatar}
                        alt={
                          user.name ||
                          "NEXORA User"
                        }
                        className="h-32 w-32 rounded-full object-cover ring-4 ring-cyan-400/10"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 text-4xl font-black text-cyan-400 ring-4 ring-cyan-400/10">
                        {initials}
                      </div>
                    )}

                    {/* Edit Button */}

                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={avatarLoading}
                      className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400 text-lg font-bold text-black shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Change profile photo"
                    >
                      ✎
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={
                        handleAvatarUpload
                      }
                      className="hidden"
                    />

                  </div>

                  {/* Name */}

                  <h2 className="mt-6 text-2xl font-black text-white">
                    {user.name ||
                      "NEXORA User"}
                  </h2>

                  <p className="mt-2 break-all text-sm text-gray-500">
                    {user.email}
                  </p>

                  {/* Role */}

                  <span className="mt-5 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {user.role || "Customer"}
                  </span>

                </div>

                {/* Avatar Actions */}

                <div className="mt-8 border-t border-white/10 pt-7">

                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={avatarLoading}
                    className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-black transition-all duration-300 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {avatarLoading
                      ? "Uploading..."
                      : "Change Photo"}
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={
                        handleDeleteAvatar
                      }
                      disabled={avatarLoading}
                      className="mt-3 w-full rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-sm font-bold text-red-400 transition-all duration-300 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove Photo
                    </button>
                  )}

                </div>

                {/* Account Info */}

                <div className="mt-8 space-y-5 border-t border-white/10 pt-7">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-600">
                      Account Status
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />

                      <p className="text-sm font-bold text-emerald-400">
                        Active
                      </p>

                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-600">
                      Email
                    </p>

                    <p className="mt-2 break-all text-sm text-gray-400">
                      {user.email}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* ===================================
                RIGHT CONTENT
            =================================== */}

            <div className="space-y-8 lg:col-span-2">

              {/* =================================
                  PERSONAL INFORMATION
              ================================= */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1119] p-6 shadow-2xl shadow-black/30 sm:p-8">

                {/* Glow */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/[0.05] blur-3xl" />

                <div className="relative">

                  <div className="mb-8">

                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                      Account Settings
                    </span>

                    <h2 className="mt-3 text-2xl font-black text-white">
                      Personal Information
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Update your basic NEXORA
                      account information.
                    </p>

                  </div>

                  <form
                    onSubmit={
                      handleUpdateProfile
                    }
                    className="space-y-6"
                  >

                    <div className="grid gap-5 sm:grid-cols-2">

                      {/* Name */}

                      <div>

                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-semibold text-gray-300"
                        >
                          Full Name
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          autoComplete="name"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                        />

                      </div>

                      {/* Email */}

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
                          disabled
                          className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-[#070c12] px-4 py-3 text-sm text-gray-600"
                        />

                        <p className="mt-2 text-xs text-gray-600">
                          Email cannot be changed
                          from this page.
                        </p>

                      </div>

                      {/* Phone */}

                      <div>

                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-semibold text-gray-300"
                        >
                          Phone Number
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+92 300 1234567"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                        />

                      </div>

                      {/* Address */}

                      <div>

                        <label
                          htmlFor="address"
                          className="mb-2 block text-sm font-semibold text-gray-300"
                        >
                          Address
                        </label>

                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your address"
                          autoComplete="street-address"
                          className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                        />

                      </div>

                    </div>

                    <div className="flex justify-end border-t border-white/10 pt-6">

                      <Button
                        type="submit"
                        disabled={saving}
                      >
                        {saving
                          ? "Saving..."
                          : "Save Changes →"}
                      </Button>

                    </div>

                  </form>

                </div>

              </div>

              {/* =================================
                  CHANGE PASSWORD
              ================================= */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1119] p-6 shadow-2xl shadow-black/30 sm:p-8">

                {/* Glow */}

                <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-blue-600/[0.05] blur-3xl" />

                <div className="relative">

                  <div className="mb-8">

                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                      Security
                    </span>

                    <h2 className="mt-3 text-2xl font-black text-white">
                      Change Password
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Keep your NEXORA account secure
                      with a strong password.
                    </p>

                  </div>

                  {/* Password Success */}

                  {passwordSuccess && (
                    <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-400">
                      {passwordSuccess}
                    </div>
                  )}

                  {/* Password Error */}

                  {passwordError && (
                    <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-400">
                      {passwordError}
                    </div>
                  )}

                  <form
                    onSubmit={
                      handleChangePassword
                    }
                    className="space-y-5"
                  >

                    {/* Current Password */}

                    <div>

                      <label
                        htmlFor="currentPassword"
                        className="mb-2 block text-sm font-semibold text-gray-300"
                      >
                        Current Password
                      </label>

                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={
                          passwordData.currentPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        placeholder="Enter current password"
                        autoComplete="current-password"
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                      />

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                      {/* New Password */}

                      <div>

                        <label
                          htmlFor="newPassword"
                          className="mb-2 block text-sm font-semibold text-gray-300"
                        >
                          New Password
                        </label>

                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={
                            passwordData.newPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                        />

                      </div>

                      {/* Confirm Password */}

                      <div>

                        <label
                          htmlFor="confirmPassword"
                          className="mb-2 block text-sm font-semibold text-gray-300"
                        >
                          Confirm Password
                        </label>

                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={
                            passwordData.confirmPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                        />

                      </div>

                    </div>

                    <div className="flex justify-end border-t border-white/10 pt-6">

                      <Button
                        type="submit"
                        disabled={
                          passwordSaving
                        }
                      >
                        {passwordSaving
                          ? "Updating..."
                          : "Update Password →"}
                      </Button>

                    </div>

                  </form>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Profile;