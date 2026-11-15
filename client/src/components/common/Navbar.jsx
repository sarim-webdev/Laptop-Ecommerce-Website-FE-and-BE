import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Package,
  Settings,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  /* =========================================
     CLOSE PROFILE ON OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================================
     CLOSE MOBILE MENU ON DESKTOP
  ========================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = async () => {
    try {
      await logout();

      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* =========================================
     CLOSE MOBILE MENU
  ========================================= */

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /* =========================================
     DESKTOP NAV LINK
  ========================================= */

  const navLinkClass = ({ isActive }) =>
    `
      group
      relative
      rounded-full
      px-4
      py-2.5
      text-sm
      font-bold
      tracking-wide
      transition-all
      duration-300
      ${isActive
      ? "bg-sky-400/10 text-sky-400 shadow-lg shadow-sky-500/10"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
    }
    `;

  /* =========================================
     MOBILE NAV LINK
  ========================================= */

  const mobileNavLinkClass = ({ isActive }) =>
    `
      flex
      items-center
      rounded-2xl
      border
      px-4
      py-3.5
      text-sm
      font-bold
      transition-all
      duration-300
      ${isActive
      ? "border-sky-400/20 bg-sky-400/10 text-sky-400 shadow-lg shadow-sky-500/10"
      : "border-[#263449] bg-white/5 text-slate-300 hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-400"
    }
    `;

  return (
    <header
      className="
        sticky
        top-0
        z-50
      "
    >
      <nav
        className="
          relative
          mx-auto
          flex
          h-[74px]
          max-w-7xl
          items-center
          justify-between
          border-b
          border-[#263449]
          bg-[#0B1220]/95
          px-4
          shadow-[0_12px_45px_rgba(0,0,0,0.35)]
          backdrop-blur-2xl
          sm:h-[78px]
          sm:px-6
          lg:px-8
        "
      >

        {/* =====================================
            SUBTLE NAVBAR GLOW
        ===================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-20
            -top-1
            h-px
            bg-gradient-to-r
            from-transparent
            via-sky-400/50
            to-transparent
          "
        />

        {/* =====================================
            LEFT NAVIGATION
        ===================================== */}

        <div className="hidden items-center gap-1 md:flex md:w-1/3">

          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>

        </div>

        {/* =====================================
            MOBILE MENU BUTTON
        ===================================== */}

        <button
          type="button"
          onClick={() =>
            setIsMobileMenuOpen((previous) => !previous)
          }
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            border
            border-[#263449]
            bg-[#172338]
            text-white
            shadow-sm
            transition-all
            duration-300
            hover:border-sky-400/30
            hover:bg-sky-400/10
            hover:text-sky-400
            active:scale-95
            md:hidden
          "
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X size={21} strokeWidth={2.5} />
          ) : (
            <Menu size={21} strokeWidth={2.5} />
          )}
        </button>

        {/* =====================================
            CENTER LOGO
        ===================================== */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="
            absolute
            left-1/2
            -translate-x-1/2
            rounded-2xl
            p-1
            transition-all
            duration-300
            hover:scale-[1.035]
          "
          aria-label="NEXORA Home"
        >
          <img
            src="/images/nexora-logo.png"
            alt="NEXORA"
            className="
              h-12
              w-auto
              max-w-[210px]
              object-contain
              sm:h-14
              sm:max-w-[260px]
              lg:h-16
              lg:max-w-[300px]
            "
          />
        </Link>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
            md:w-1/3
            md:gap-2.5
          "
        >

          {/* ===================================
              SHOPPING CART
          =================================== */}

          <Link
            to="/cart"
            className="
              group
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-[#263449]
              bg-[#172338]
              text-slate-300
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-sky-400/30
              hover:bg-sky-400/10
              hover:text-sky-400
              hover:shadow-md
              active:scale-95
            "
            aria-label="Shopping cart"
          >
            <ShoppingCart
              size={19}
              strokeWidth={2.2}
              className="
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-1.5
                  -top-1.5
                  flex
                  h-[20px]
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-sky-400
                  to-blue-600
                  px-1
                  text-[9px]
                  font-black
                  leading-none
                  text-white
                  shadow-md
                  shadow-sky-500/30
                  ring-2
                  ring-[#0B1220]
                "
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* ===================================
              AUTHENTICATED USER
          =================================== */}

          {isAuthenticated && user ? (
            <div
              ref={profileRef}
              className="relative hidden md:block"
            >

              <button
                type="button"
                onClick={() =>
                  setIsProfileOpen((previous) => !previous)
                }
                className="
                  group
                  flex
                  items-center
                  gap-2.5
                  rounded-2xl
                  border
                  border-[#263449]
                  bg-[#172338]
                  px-2
                  py-1.5
                  shadow-sm
                  transition-all
                  duration-300
                  hover:border-sky-400/30
                  hover:bg-sky-400/10
                  hover:shadow-md
                "
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
              >

                {/* AVATAR */}

                {user.avatar.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name || "User"}
                    className="
                      h-9
                      w-9
                      rounded-xl
                      object-cover
                      ring-2
                      ring-[#0B1220]
                      shadow-sm
                    "
                  />
                ) : (
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-sky-400
                      via-blue-600
                      to-blue-600
                      text-sm
                      font-black
                      text-white
                      shadow-sm
                    "
                  >
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}

                <span
                  className="
                    hidden
                    max-w-28
                    truncate
                    text-sm
                    font-bold
                    text-white
                    lg:block
                  "
                >
                  {user.name || "Account"}
                </span>

                <ChevronDown
                  size={15}
                  strokeWidth={2.5}
                  className={`
                    text-slate-400
                    transition-all
                    duration-300
                    ${isProfileOpen
                      ? "rotate-180 text-sky-400"
                      : "group-hover:text-sky-400"
                    }
                  `}
                />

              </button>

              {/* =================================
                  PROFILE DROPDOWN
              ================================= */}

              {isProfileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-72
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-[#263449]
                    bg-[#111C2E]
                    shadow-[0_25px_70px_rgba(0,0,0,0.45)]
                    backdrop-blur-xl
                  "
                >

                  {/* USER INFO */}

                  <div
                    className="
                      border-b
                      border-white/10
                      bg-gradient-to-br
                      from-[#172338]
                      via-[#111C2E]
                      to-sky-400/5
                      px-4
                      py-4
                    "
                  >

                    <div className="flex items-center gap-3">

                      {user.avatar.url ? (
                        <img
                          src={user.avatar.url}
                          alt={user.name || "User"}
                          className="
                            h-11
                            w-11
                            rounded-2xl
                            object-cover
                            ring-2
                            ring-sky-400/20
                            shadow-sm
                          "
                        />
                      ) : (
                        <span
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-sky-400
                            to-blue-600
                            text-sm
                            font-black
                            text-white
                            shadow-md
                          "
                        >
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </span>
                      )}

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            text-sm
                            font-black
                            text-white
                          "
                        >
                          {user.name || "User"}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            font-medium
                            text-slate-400
                          "
                        >
                          {user.email || ""}
                        </p>

                      </div>
                    </div>

                    {user.role === "admin" && (
                      <span
                        className="
                          mt-3
                          inline-flex
                          rounded-full
                          bg-sky-400/10
                          px-3
                          py-1
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.12em]
                          text-sky-400
                          ring-1
                          ring-sky-400/20
                        "
                      >
                        Admin
                      </span>
                    )}

                  </div>

                  {/* MENU */}

                  <div className="p-2">

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        px-3
                        py-3
                        text-sm
                        font-bold
                        text-slate-300
                        transition-all
                        duration-200
                        hover:bg-sky-400/10
                        hover:text-sky-400
                      "
                    >
                      <User size={17} strokeWidth={2.2} />
                      Profile
                    </Link>

                    {user.role !== "admin" && (
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="
      flex
      items-center
      gap-3
      rounded-2xl
      px-3
      py-3
      text-sm
      font-bold
      text-slate-300
      transition-all
      duration-200
      hover:bg-sky-400/10
      hover:text-sky-400
    "
                      >
                        <Package size={17} strokeWidth={2.2} />
                        My Orders
                      </Link>
                    )}

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          px-3
                          py-3
                          text-sm
                          font-bold
                          text-slate-300
                          transition-all
                          duration-200
                          hover:bg-sky-400/10
                          hover:text-sky-400
                        "
                      >
                        <Settings
                          size={17}
                          strokeWidth={2.2}
                        />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="my-2 border-t border-white/10" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-2xl
                        px-3
                        py-3
                        text-left
                        text-sm
                        font-bold
                        text-red-600
                        transition-all
                        duration-200
                        hover:bg-red-500/10
                      "
                    >
                      <LogOut
                        size={17}
                        strokeWidth={2.2}
                      />
                      Logout
                    </button>

                  </div>
                </div>
              )}
            </div>
          ) : (
            /* DESKTOP SIGN IN */

            <Link
              to="/sign-in"
              className="
                hidden
                rounded-full
                bg-gradient-to-r
                from-sky-400
                to-blue-600
                px-5
                py-2.5
                text-sm
                font-black
                text-white
                shadow-lg
                shadow-black/30
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:from-sky-400
                hover:to-blue-600
                hover:shadow-sky-500/25
                active:translate-y-0
                md:block
              "
            >
              Sign In
            </Link>
          )}

          {/* ===================================
              MOBILE PROFILE / SIGN IN
          =================================== */}

          {isAuthenticated && user ? (
            <Link
              to="/profile"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-[#263449]
                bg-[#172338]
                shadow-sm
                transition-all
                duration-300
                hover:border-sky-400/30
                hover:bg-sky-400/10
                active:scale-95
                md:hidden
              "
              aria-label="Profile"
            >
              {user.avatar.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.name || "User"}
                  className="
                    h-8
                    w-8
                    rounded-xl
                    object-cover
                  "
                />
              ) : (
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-sky-400
                    to-blue-600
                    text-xs
                    font-black
                    text-white
                  "
                >
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-[#263449]
                bg-[#172338]
                text-slate-300
                shadow-sm
                transition-all
                duration-300
                hover:border-sky-400/30
                hover:bg-sky-400/10
                hover:text-sky-400
                active:scale-95
                md:hidden
              "
              aria-label="Sign in"
            >
              <User size={20} strokeWidth={2} />
            </Link>
          )}

        </div>
      </nav>

      {/* =========================================
          MOBILE NAVIGATION
      ========================================= */}

      {isMobileMenuOpen && (
        <div
          className="
            mx-3
            mt-2
            overflow-hidden
            rounded-[22px]
            border
            border-[#263449]
            bg-[#0B1220]/95
            shadow-[0_20px_55px_rgba(0,0,0,0.40)]
            backdrop-blur-2xl
            md:hidden
            sm:mx-5
          "
        >

          <div
            className="
              mx-auto
              max-w-7xl
              px-4
              py-4
              sm:px-5
            "
          >

            <div className="flex flex-col gap-1.5">

              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                Products
              </NavLink>

              <NavLink
                to="/contact"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                Contact
              </NavLink>

              <div className="my-2 border-t border-white/10" />

              {isAuthenticated && user ? (
                <>

                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      px-4
                      py-3.5
                      text-sm
                      font-bold
                      text-slate-300
                      transition-all
                      hover:bg-sky-400/10
                      hover:text-sky-400
                    "
                  >
                    <User size={18} strokeWidth={2.2} />
                    Profile
                  </Link>

                  {user.role !== "admin" && (
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="
      flex
      items-center
      gap-3
      rounded-2xl
      px-3
      py-3
      text-sm
      font-bold
      text-slate-300
      transition-all
      duration-200
      hover:bg-sky-400/10
      hover:text-sky-400
    "
                    >
                      <Package size={17} strokeWidth={2.2} />
                      My Orders
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        px-4
                        py-3.5
                        text-sm
                        font-bold
                        text-slate-300
                        transition-all
                        hover:bg-sky-400/10
                        hover:text-sky-400
                      "
                    >
                      <Settings
                        size={18}
                        strokeWidth={2.2}
                      />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      px-4
                      py-3.5
                      text-left
                      text-sm
                      font-bold
                      text-red-600
                      transition-all
                      hover:bg-red-500/10
                    "
                  >
                    <LogOut
                      size={18}
                      strokeWidth={2.2}
                    />
                    Logout
                  </button>

                </>
              ) : (
                <Link
                  to="/sign-in"
                  onClick={closeMobileMenu}
                  className="
                    mt-1
                    rounded-full
                    bg-gradient-to-r
                    from-sky-400
                    to-blue-600
                    px-4
                    py-3.5
                    text-center
                    text-sm
                    font-black
                    text-white
                    shadow-lg
                    shadow-black/30
                    transition-all
                    duration-300
                    hover:from-sky-400
                    hover:to-blue-600
                    hover:shadow-sky-500/25
                    active:scale-[0.99]
                  "
                >
                  Sign In
                </Link>
              )}

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;