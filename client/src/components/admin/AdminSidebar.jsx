import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Tags,
  MessageSquare,
  X,
  Store,
  ExternalLink,
} from "lucide-react";

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: Tags,
    },
    {
      name: "Contacts",
      path: "/admin/contacts",
      icon: MessageSquare,
    },
  ];

  return (
    <>
      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}


      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r border-white/10
          bg-[#05080d]
          shadow-2xl shadow-black/40
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* =========================================
            LOGO / BRAND
        ========================================= */}

        <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">

          {/* Subtle Glow */}

          <div className="pointer-events-none absolute -left-10 top-0 h-20 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

          <NavLink
            to="/admin"
            onClick={onClose}
            className="relative flex items-center gap-3"
          >

            {/* Logo Icon */}

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 shadow-lg shadow-cyan-500/10">

              <Store
                size={19}
                className="text-cyan-400"
              />

            </div>


            {/* Brand */}

            <div>

              <h1 className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-lg font-black tracking-[0.15em] text-transparent">
                NEXORA
              </h1>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                Administration
              </p>

            </div>

          </NavLink>


          {/* Mobile Close */}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-gray-500 transition-all duration-300 hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-400 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>


        {/* =========================================
            NAVIGATION
        ========================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-6">

          {/* Management Label */}

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            Management
          </p>


          {/* Navigation Items */}

          <div className="space-y-1">

            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group relative flex items-center gap-3
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    transition-all duration-300
                    ${
                      isActive
                        ? `
                          border border-cyan-400/20
                          bg-gradient-to-r
                          from-cyan-400/15
                          to-blue-500/5
                          text-white
                          shadow-lg
                          shadow-cyan-500/5
                        `
                        : `
                          border border-transparent
                          text-gray-500
                          hover:border-white/5
                          hover:bg-white/[0.04]
                          hover:text-gray-200
                        `
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}

                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/60" />
                      )}


                      {/* Icon */}

                      <Icon
                        size={19}
                        className={`
                          transition-all duration-300
                          ${
                            isActive
                              ? "text-cyan-400"
                              : "text-gray-600 group-hover:text-cyan-400"
                          }
                        `}
                      />


                      {/* Name */}

                      <span>
                        {item.name}
                      </span>


                      {/* Active Glow Dot */}

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/70" />
                      )}

                    </>
                  )}
                </NavLink>
              );
            })}

          </div>


          {/* =========================================
              STORE SECTION
          ========================================= */}

          <div className="mt-8">

            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
              Store
            </p>


            <NavLink
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-medium text-gray-500 transition-all duration-300 hover:border-cyan-400/10 hover:bg-cyan-400/5 hover:text-gray-200"
            >

              <Store
                size={19}
                className="text-gray-600 transition-colors duration-300 group-hover:text-cyan-400"
              />

              <span>
                View Store
              </span>

              <ExternalLink
                size={15}
                className="ml-auto text-gray-700 transition-colors duration-300 group-hover:text-cyan-400"
              />

            </NavLink>

          </div>

        </nav>


        {/* =========================================
            BOTTOM SECTION
        ========================================= */}

        <div className="shrink-0 border-t border-white/10 p-4">

          {/* System Status Card */}

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-4">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl" />


            <div className="relative">

              {/* Status */}

              <div className="mb-2 flex items-center gap-2">

                <span className="relative flex h-2 w-2">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />

                </span>

                <span className="text-xs font-semibold text-gray-300">
                  System Online
                </span>

              </div>


              {/* Description */}

              <p className="text-[11px] leading-5 text-gray-600">
                NEXORA administration panel is running normally.
              </p>

            </div>

          </div>


          {/* Copyright */}

          <p className="mt-4 text-center text-[10px] font-medium text-gray-700">
            © {new Date().getFullYear()} NEXORA
          </p>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;