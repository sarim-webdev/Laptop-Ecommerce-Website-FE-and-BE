import { useCallback, useEffect, useState } from "react";

import StatsCard from "../../components/admin/StatsCard";
import adminService from "../../services/adminService";


/* =========================================
   ADMIN DASHBOARD
========================================= */

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================================
     FETCH DASHBOARD DATA
  ========================================= */

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        statsResponse,
        usersResponse,
        productsResponse,
      ] = await Promise.all([
        adminService.getDashboardStats(),

        adminService.getRecentUsers({
          limit: 5,
        }),

        adminService.getLowStockProducts({
          threshold: 5,
        }),
      ]);

      const dashboardData =
        statsResponse?.data ||
        statsResponse ||
        {};

      const overview =
        dashboardData?.overview || {};

      setStats({
        totalUsers:
          overview.totalUsers ?? 0,

        totalProducts:
          overview.totalProducts ?? 0,

        totalOrders:
          overview.totalOrders ?? 0,

        totalRevenue:
          overview.totalRevenue ?? 0,
      });


      /* Recent Users */

      const users =
        usersResponse?.data?.users ||
        usersResponse?.users ||
        usersResponse?.data ||
        [];

      setRecentUsers(
        Array.isArray(users)
          ? users
          : []
      );


      /* Low Stock Products */

      const products =
        productsResponse?.data?.products ||
        productsResponse?.products ||
        productsResponse?.data ||
        [];

      setLowStockProducts(
        Array.isArray(products)
          ? products
          : []
      );

    } catch (err) {

      console.error(
        "Dashboard Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load dashboard data."
      );

    } finally {

      setLoading(false);

    }
  }, []);


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080d] text-white">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }


  /* =========================================
     DASHBOARD UI
  ========================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080d] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">


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
              Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Welcome back. Here's what's happening
              with NEXORA today.
            </p>

          </div>


          {/* Refresh */}

          <button
            type="button"
            onClick={fetchDashboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0b1119] px-5 py-2.5 text-sm font-semibold text-slate-300 shadow-lg shadow-black/20 transition-all duration-300 hover:border-cyan-400/30 hover:bg-[#101923] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >

            <span
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>

            {loading
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>


        {/* =========================================
            ERROR
        ========================================= */}

        {error && (

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3">

            <p className="text-sm font-medium text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboard}
              className="shrink-0 text-sm font-semibold text-red-400 underline"
            >
              Retry
            </button>

          </div>

        )}


        {/* =========================================
            STATS CARDS
        ========================================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
          />

          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon="💻"
          />

          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="📦"
          />

          <StatsCard
            title="Total Revenue"
            value={`$${Number(
              stats.totalRevenue
            ).toLocaleString()}`}
            icon="💰"
          />

        </div>


        {/* =========================================
            LOWER SECTIONS
        ========================================= */}

        <div className="grid gap-6 lg:grid-cols-2">


          {/* =========================================
              RECENT USERS
          ========================================= */}

          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/30">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-3xl" />


            <div className="relative">

              {/* Header */}

              <div className="flex flex-col gap-2 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Users
                  </span>

                  <h2 className="mt-1 text-lg font-bold text-white">
                    Recent Users
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest registered customers.
                  </p>

                </div>


                <span className="inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
                  {recentUsers.length}
                </span>

              </div>


              {/* Users */}

              {recentUsers.length === 0 ? (

                <div className="px-6 py-16 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#070c12] text-2xl shadow-lg">
                    👥
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-white">
                    No recent users
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    New registered customers will appear here.
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-white/[0.06]">

                  {recentUsers.map((user) => (

                    <div
                      key={user._id}
                      className="flex items-center gap-4 px-6 py-4 transition duration-300 hover:bg-white/[0.025]"
                    >

                      {/* Avatar */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#070c12] text-sm font-bold text-slate-400">

                        {user.avatar?.url ? (

                          <img
                            src={user.avatar.url}
                            alt={
                              user.name ||
                              "User"
                            }
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          (
                            user.name ||
                            user.email ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()

                        )}

                      </div>


                      {/* User Info */}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-white">
                          {user.name ||
                            "Unnamed User"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {user.email ||
                            "No email"}
                        </p>

                      </div>


                      {/* Status */}

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          user.isActive === false
                            ? "border-red-400/20 bg-red-400/10 text-red-400"
                            : "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                        }`}
                      >
                        {user.isActive === false
                          ? "Inactive"
                          : "Active"}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </section>


          {/* =========================================
              LOW STOCK PRODUCTS
          ========================================= */}

          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/30">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-orange-400/[0.04] blur-3xl" />


            <div className="relative">

              {/* Header */}

              <div className="flex flex-col gap-2 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Inventory
                  </span>

                  <h2 className="mt-1 text-lg font-bold text-white">
                    Low Stock Products
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Products that need inventory attention.
                  </p>

                </div>


                <span className="inline-flex w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-400">
                  {lowStockProducts.length}
                </span>

              </div>


              {/* Products */}

              {lowStockProducts.length === 0 ? (

                <div className="px-6 py-16 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#070c12] text-2xl shadow-lg">
                    📦
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-white">
                    Inventory Looks Good
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    All products have sufficient stock.
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-white/[0.06]">

                  {lowStockProducts.map(
                    (product) => (

                      <div
                        key={product._id}
                        className="flex items-center gap-4 px-6 py-4 transition duration-300 hover:bg-white/[0.025]"
                      >

                        {/* Product Image */}

                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#070c12]">

                          {product.images?.[0]?.url ? (

                            <img
                              src={
                                product.images[0].url
                              }
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full w-full items-center justify-center text-lg">
                              💻
                            </div>

                          )}

                        </div>


                        {/* Product Info */}

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-white">
                            {product.name ||
                              "Unnamed Product"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">

                            Stock:{" "}

                            <span className="font-semibold text-orange-400">
                              {product.stock ?? 0}
                            </span>

                          </p>

                        </div>


                        {/* Badge */}

                        <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                          Low Stock
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>

        </div>

      </div>

    </main>
  );
};

export default AdminDashboard;