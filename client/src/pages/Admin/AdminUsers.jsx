import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import UserTable from "../../components/admin/UserTable";
import Loader from "../../components/common/Loader";


const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [refreshing, setRefreshing] = useState(false);


  /* =========================================
     FETCH USERS
  ========================================= */

  const fetchUsers = async () => {
    try {
      setError("");

      const response =
        await adminService.getAllUsers();

      const usersData =
        response?.data?.users ||
        response?.users ||
        response?.data ||
        [];

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );

    } catch (error) {

      console.error(
        "Failed to fetch users:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to load users."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    fetchUsers();
  }, []);


  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };


  /* =========================================
     DELETE USER
  ========================================= */

  const handleDeleteUser = async (userId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await adminService.deleteUser(userId);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user._id !== userId
        )
      );

    } catch (error) {

      console.error(
        "Failed to delete user:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to delete user."
      );

    }
  };


  /* =========================================
     UPDATE USER ROLE
  ========================================= */

  const handleUpdateRole = async (
    userId,
    role
  ) => {

    try {

      const response =
        await adminService.updateUserRole(
          userId,
          { role }
        );

      const updatedUser =
        response?.data?.user ||
        response?.user;

      if (updatedUser) {

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user._id === userId
              ? updatedUser
              : user
          )
        );

      } else {

        await fetchUsers();

      }

    } catch (error) {

      console.error(
        "Failed to update user role:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to update user role."
      );

    }
  };


  /* =========================================
     UPDATE USER STATUS
  ========================================= */

  const handleUpdateStatus = async (
    userId,
    isActive
  ) => {

    try {

      const response =
        await adminService.updateUserStatus(
          userId,
          { isActive }
        );

      const updatedUser =
        response?.data?.user ||
        response?.user;

      if (updatedUser) {

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user._id === userId
              ? updatedUser
              : user
          )
        );

      } else {

        await fetchUsers();

      }

    } catch (error) {

      console.error(
        "Failed to update user status:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to update user status."
      );

    }
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080d] text-white">
        <Loader />
      </div>
    );

  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05080d] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

      {/* =========================================
          BACKGROUND GLOWS
      ========================================= */}

      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/[0.05] blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/[0.03] blur-3xl" />


      <div className="relative mx-auto max-w-7xl space-y-6">


        {/* =========================================
            HEADER
        ========================================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              NEXORA ADMINISTRATION
            </span>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Users
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage registered customers, user roles,
              and account status from your admin panel.
            </p>

          </div>


          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0b1119] px-5 py-2.5 text-sm font-semibold text-slate-300 shadow-lg shadow-black/20 transition-all duration-300 hover:border-cyan-400/30 hover:bg-[#101923] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >

            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>


        {/* =========================================
            ERROR
        ========================================= */}

        {error && (

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3">

            <div className="flex items-start gap-3">

              <span className="text-base">
                ⚠
              </span>

              <p className="text-sm font-medium text-red-400">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={fetchUsers}
              className="shrink-0 text-sm font-semibold text-red-400 underline"
            >
              Retry
            </button>

          </div>

        )}


        {/* =========================================
            USER STAT
        ========================================= */}

        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-6 shadow-2xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">

          {/* Glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/[0.07] blur-3xl transition duration-500 group-hover:bg-cyan-500/[0.12]" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-600/[0.05] blur-3xl" />


          {/* Top Accent */}

          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />


          <div className="relative flex items-center justify-between gap-5">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Registered Customers
              </p>

              <p className="mt-3 text-4xl font-black tracking-tight text-white">
                {users.length}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Total users registered on NEXORA
              </p>

            </div>


            {/* Icon */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-400 shadow-lg shadow-cyan-500/5 transition-all duration-500 group-hover:scale-105 group-hover:border-cyan-400/40 group-hover:bg-cyan-400 group-hover:text-black">

              👥

            </div>

          </div>


          {/* Bottom Accent */}

          <div className="relative mt-6 h-px w-full bg-gradient-to-r from-cyan-400/30 via-cyan-400/5 to-transparent" />

        </div>


        {/* =========================================
            USERS TABLE
        ========================================= */}

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/30">

          {/* Table Glow */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-3xl" />


          <div className="relative">

            {/* Table Header */}

            <div className="flex flex-col gap-2 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                  NEXORA CUSTOMERS
                </span>

                <h2 className="mt-1 text-lg font-bold text-white">
                  All Users
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage accounts, roles and permissions.
                </p>

              </div>


              <span className="inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
                {users.length} Users
              </span>

            </div>


            {/* Empty State */}

            {users.length === 0 ? (

              <div className="px-6 py-16 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#070c12] text-2xl shadow-lg">
                  👥
                </div>

                <h2 className="mt-5 text-lg font-bold text-white">
                  No users found
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Registered customers will appear here.
                </p>

              </div>

            ) : (

              /* User Table */

              <div className="overflow-x-auto">

                <UserTable
                  users={users}
                  onDelete={handleDeleteUser}
                  onUpdateRole={handleUpdateRole}
                  onUpdateStatus={handleUpdateStatus}
                />

              </div>

            )}

          </div>

        </div>


      </div>

    </section>
  );
};


export default AdminUsers;