import { Link } from "react-router-dom";

/* =========================================
   FOOTER COMPONENT
========================================= */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#05070b] text-slate-300">

      {/* =========================================
          NEWSLETTER SECTION
      ========================================= */}

      <div className="border-b border-white/10 bg-[#080b12]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

            {/* Newsletter Content */}

            <div className="max-w-xl">

              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Stay Updated
              </span>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Get the latest from NEXORA
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
                Subscribe to our newsletter and receive the latest
                laptop launches, exclusive offers, and technology updates.
              </p>

            </div>

            {/* Newsletter Form */}

            <form
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >

              <label
                htmlFor="newsletter-email"
                className="sr-only"
              >
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                required
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  px-4 py-3
                  text-sm text-white
                  outline-none
                  transition
                  placeholder:text-slate-600
                  focus:border-cyan-400
                  focus:bg-white/[0.06]
                  focus:ring-4
                  focus:ring-cyan-400/10
                "
              />

              <button
                type="submit"
                className="
                  rounded-xl
                  bg-cyan-500
                  px-6 py-3
                  text-sm font-bold
                  text-slate-950
                  shadow-lg
                  shadow-cyan-500/10
                  transition
                  duration-200
                  hover:bg-cyan-400
                  hover:shadow-cyan-400/20
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-400
                  focus:ring-offset-2
                  focus:ring-offset-[#080b12]
                "
              >
                Subscribe
              </button>

            </form>

          </div>

        </div>

      </div>


      {/* =========================================
          MAIN FOOTER
      ========================================= */}

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">


          {/* =====================================
              BRAND
          ===================================== */}

          <div className="sm:col-span-2 lg:col-span-1">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  border border-cyan-400/20
                  bg-cyan-400/10
                  shadow-lg
                  shadow-cyan-500/10
                "
              >
                <span className="text-lg font-black text-cyan-400">
                  N
                </span>
              </div>

              <span className="text-2xl font-black tracking-tight text-white">
                NEXORA
                <span className="text-cyan-400">.</span>
              </span>

            </Link>


            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Your trusted destination for premium laptops and
              modern technology. Discover powerful performance,
              innovative design, and reliable devices with NEXORA.
            </p>


            {/* Social Links */}

            <div className="mt-7 flex items-center gap-3">

              {/* Facebook */}

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  text-slate-400
                  transition
                  duration-200
                  hover:border-blue-500/40
                  hover:bg-blue-500/10
                  hover:text-blue-400
                "
              >

                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.5 22v-8h2.75l.5-3h-3.25V9.1c0-.87.24-1.46 1.5-1.46h1.6V4.96c-.28-.04-1.23-.12-2.34-.12-2.31 0-3.89 1.41-3.89 4V11H7.75v3h2.62v8h3.13Z" />
                </svg>

              </a>


              {/* Instagram */}

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  text-slate-400
                  transition
                  duration-200
                  hover:border-pink-500/40
                  hover:bg-pink-500/10
                  hover:text-pink-400
                "
              >

                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >

                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />

                </svg>

              </a>


              {/* X */}

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  text-slate-400
                  transition
                  duration-200
                  hover:border-white/30
                  hover:bg-white/10
                  hover:text-white
                "
              >

                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >

                  <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.37l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.09 17.79h1.72L8.28 4.08H6.44L17.81 19.79Z" />

                </svg>

              </a>


              {/* LinkedIn */}

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  text-slate-400
                  transition
                  duration-200
                  hover:border-blue-500/40
                  hover:bg-blue-500/10
                  hover:text-blue-400
                "
              >

                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >

                  <path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.8c0-3.77-2.02-5.53-4.72-5.53-2.18 0-3.15 1.2-3.69 2.05V8.5H9.1V21h3.49v-6.19c0-1.63.31-3.21 2.33-3.21 1.99 0 2.02 1.87 2.02 3.32V21H21v-7.2Z" />

                </svg>

              </a>

            </div>

          </div>


          {/* =====================================
              QUICK LINKS
          ===================================== */}

          <div>

            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">

              {[
                ["Home", "/"],
                ["Products", "/products"],
                ["Contact Us", "/contact"],
                ["My Account", "/profile"],
                ["My Orders", "/orders"],
              ].map(([label, path]) => (

                <li key={label}>

                  <Link
                    to={path}
                    className="
                      group
                      flex items-center gap-2
                      text-sm text-slate-400
                      transition
                      hover:text-cyan-400
                    "
                  >

                    <span
                      className="
                        h-px w-0
                        bg-cyan-400
                        transition-all
                        duration-200
                        group-hover:w-3
                      "
                    />

                    {label}

                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* =====================================
              CUSTOMER SUPPORT
          ===================================== */}

          <div>

            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Customer Support
            </h3>

            <ul className="mt-6 space-y-4">

              {[
                "Help Center",
                "Shipping Information",
                "Returns & Refunds",
                "Warranty",
                "Contact Support",
              ].map((item) => (

                <li key={item}>

                  <Link
                    to="/contact"
                    className="
                      group
                      flex items-center gap-2
                      text-sm text-slate-400
                      transition
                      hover:text-cyan-400
                    "
                  >

                    <span
                      className="
                        h-px w-0
                        bg-cyan-400
                        transition-all
                        duration-200
                        group-hover:w-3
                      "
                    />

                    {item}

                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* =====================================
              CONTACT INFORMATION
          ===================================== */}

          <div>

            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Contact Us
            </h3>


            <div className="mt-6 space-y-5">

              {/* Address */}

              <div className="flex items-start gap-3">

                <div
                  className="
                    mt-0.5 flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-cyan-400/10
                    bg-cyan-400/5
                    text-cyan-400
                  "
                >

                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >

                    <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />

                    <circle
                      cx="12"
                      cy="9"
                      r="2.5"
                    />

                  </svg>

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Karachi, Pakistan
                  </p>

                </div>

              </div>


              {/* Email */}

              <div className="flex items-start gap-3">

                <div
                  className="
                    mt-0.5 flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-cyan-400/10
                    bg-cyan-400/5
                    text-cyan-400
                  "
                >

                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >

                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />

                    <path d="m3 7 9 6 9-6" />

                  </svg>

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Email
                  </p>

                  <a
                    href="mailto:support@nexora.com"
                    className="
                      mt-1 block
                      text-sm text-slate-400
                      transition
                      hover:text-cyan-400
                    "
                  >
                    support@nexora.com
                  </a>

                </div>

              </div>


              {/* Phone */}

              <div className="flex items-start gap-3">

                <div
                  className="
                    mt-0.5 flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-cyan-400/10
                    bg-cyan-400/5
                    text-cyan-400
                  "
                >

                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >

                    <path d="M6.6 3.5h2.7l1.3 4-1.9 1.5a15.8 15.8 0 0 0 6.3 6.3l1.5-1.9 4 1.3v2.7c0 1-.8 1.8-1.8 1.8C10.9 19.2 4.8 13.1 4.8 5.3c0-1 .8-1.8 1.8-1.8Z" />

                  </svg>

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Phone
                  </p>

                  <a
                    href="tel:+923001234567"
                    className="
                      mt-1 block
                      text-sm text-slate-400
                      transition
                      hover:text-cyan-400
                    "
                  >
                    +92 300 1234567
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          BOTTOM FOOTER
      ========================================= */}

      <div className="border-t border-white/10 bg-[#030509]">

        <div
          className="
            mx-auto flex max-w-7xl
            flex-col items-center
            justify-between gap-4
            px-4 py-6
            sm:px-6
            md:flex-row
            lg:px-8
          "
        >

          <p className="text-center text-sm text-slate-600 md:text-left">
            © {currentYear} NEXORA. All rights reserved.
          </p>


          <div className="flex flex-wrap items-center justify-center gap-6">

            <Link
              to="/"
              className="
                text-sm text-slate-600
                transition
                hover:text-cyan-400
              "
            >
              Privacy Policy
            </Link>

            <Link
              to="/"
              className="
                text-sm text-slate-600
                transition
                hover:text-cyan-400
              "
            >
              Terms & Conditions
            </Link>

            <Link
              to="/contact"
              className="
                text-sm text-slate-600
                transition
                hover:text-cyan-400
              "
            >
              Support
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;