import { useState } from "react";
import {
  Menu,
  Bell,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AdminNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = async () => {
  try {
    await logout();
    navigate("/", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-[#05080d]/95 shadow-lg shadow-black/20 backdrop-blur-xl">

      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =========================================
            LEFT SIDE
        ========================================= */}

        <div className="gap-4">

        </div>


        {/* =========================================
            RIGHT SIDE
        ========================================= */}

        <div className="flex items-center gap-2 sm:gap-4">

          {/* =========================================
              NOTIFICATIONS
          ========================================= */}

          <button
            type="button"
            className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-400 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400"
            aria-label="Notifications"
          >

            <Bell
              size={20}
              className="transition-transform duration-300 group-hover:scale-105"
            />

            {/* Notification Dot */}

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/60" />

          </button>


          {/* Divider */}

          <div className="hidden h-8 w-px bg-white/10 sm:block" />


          {/* =========================================
              PROFILE
          ========================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setShowProfileMenu((previous) => !previous)
              }
              className="group flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
            >

              {/* Avatar */}

              {user?.avatar?.url ? (

                <img
                  src={user.avatar.url}
                  alt={user?.name || "Admin"}
                  className="h-9 w-9 rounded-full border border-cyan-400/20 object-cover shadow-lg shadow-cyan-500/10"
                />

              ) : (

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 text-cyan-400">
                  <UserCircle size={23} />
                </div>

              )}


              {/* User Info */}

              <div className="hidden text-left md:block">

                <p className="max-w-32 truncate text-sm font-semibold text-white">
                  {user?.name || "Administrator"}
                </p>

                <p className="text-xs capitalize text-gray-500">
                  {user?.role || "Admin"}
                </p>

              </div>


              {/* Chevron */}

              <ChevronDown
                size={16}
                className={`hidden text-gray-500 transition-all duration-300 md:block ${
                  showProfileMenu
                    ? "rotate-180 text-cyan-400"
                    : ""
                }`}
              />

            </button>


            {/* =========================================
                PROFILE DROPDOWN
            ========================================= */}

            {showProfileMenu && (

              <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1119]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">

                {/* Dropdown Glow */}

                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />


                {/* =====================================
                    USER INFORMATION
                ===================================== */}

                <div className="relative border-b border-white/10 px-4 py-4">

                  <div className="flex items-center gap-3">

                    {/* Small Avatar */}

                    {user?.avatar?.url ? (

                      <img
                        src={user.avatar.url}
                        alt={user?.name || "Admin"}
                        className="h-10 w-10 rounded-full border border-cyan-400/20 object-cover"
                      />

                    ) : (

                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                        <UserCircle size={23} />
                      </div>

                    )}

                    <div className="min-w-0">

                      <p className="truncate text-sm font-bold text-white">
                        {user?.name || "Administrator"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user?.email || "Admin account"}
                      </p>

                    </div>

                  </div>


                  {/* Admin Badge */}

                  <div className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {user?.role || "Admin"}
                  </div>

                </div>


                {/* =====================================
                    MENU ITEMS
                ===================================== */}

                <div className="relative space-y-1 p-2">

                  {/* View Profile */}

                  <Link
                    to="/profile"
                    onClick={() =>
                      setShowProfileMenu(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition-all duration-300 hover:bg-cyan-400/10 hover:text-cyan-400"
                  >

                    <UserCircle size={18} />

                    <span>
                      View Profile
                    </span>

                  </Link>


                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-400/10 hover:text-red-300"
                  >

                    <LogOut size={18} />

                    <span>
                      Logout
                    </span>

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;