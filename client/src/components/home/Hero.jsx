import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative isolate min-h-[calc(100vh-78px)] overflow-hidden bg-slate-950">

      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          -z-30
          bg-cover
          bg-center
          bg-no-repeat
          bg-[length:auto_100%]
          sm:bg-[length:cover]
        "
        style={{
          backgroundImage: "url('/images/hero-section-image.png')",
        }}
      />

      {/* =====================================================
          OVERLAYS
      ===================================================== */}

      <div className="absolute inset-0 -z-20 bg-black/20" />

      <div
        className="
          absolute
          inset-0
          -z-20
          bg-gradient-to-r
          from-black/80
          via-black/45
          to-black/25
        "
      />

      <div
        className="
          absolute
          inset-0
          -z-20
          bg-gradient-to-b
          from-black/20
          via-transparent
          to-slate-950/80
        "
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          -z-10
          h-24
          bg-gradient-to-t
          from-slate-950
          to-transparent
        "
      />

      {/* =====================================================
          DECORATIVE LIGHTS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-1/3
          -z-10
          h-80
          w-80
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-10
          -z-10
          h-80
          w-80
          rounded-full
          bg-blue-600/10
          blur-3xl
        "
      />

      {/* =====================================================
          HERO CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[calc(100vh-78px)]
          max-w-7xl
          items-center
          justify-center
          px-5
          py-12
          sm:px-6
          sm:py-16
          lg:px-8
          lg:py-20
        "
      >
        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            flex
            w-full
            max-w-4xl
            flex-col
            items-center
            text-center
          "
        >

          {/* =================================================
              BADGE
          ================================================= */}

          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-white/10
              px-4
              py-2
              backdrop-blur-xl
              sm:mb-6
            "
          >
            <span className="relative flex h-2 w-2">
              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-cyan-400
                  opacity-60
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                  bg-cyan-400
                "
              />
            </span>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white/90
                sm:text-xs
              "
            >
              Next-Gen Laptops
            </span>
          </div>

          {/* =================================================
              MAIN HEADING
          ================================================= */}

          <h1
            className="
              max-w-5xl
              text-4xl
              font-black
              leading-[1.03]
              tracking-[-0.035em]
              text-white
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
              xl:text-[5rem]
            "
          >
            Power Your World.

            <span
              className="
                mt-1
                block
                bg-gradient-to-r
                from-cyan-300
                via-sky-400
                to-blue-500
                bg-clip-text
                text-transparent
                sm:mt-3
              "
            >
              Unleash Your Potential.
            </span>
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p
            className="
              mt-3
              max-w-2xl
              px-2
              text-sm
              leading-6
              text-slate-200/90
              sm:mt-5
              sm:text-base
              sm:leading-7
              lg:text-lg
            "
          >
            Discover premium laptops built for performance, creativity,
            gaming, and everything in between. Experience powerful
            technology designed for the way you work and live.
          </p>

          {/* =================================================
              CTA
          ================================================= */}

          <div
            className="
              mt-5
              flex
              w-full
              justify-center
              sm:mt-6
            "
          >
            <Link
              to="/products"
              className="
                group
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-white
                px-6
                py-3
                text-sm
                font-bold
                text-slate-950
                shadow-xl
                shadow-black/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-cyan-50
                hover:shadow-cyan-500/20
                active:translate-y-0
                sm:w-auto
                sm:min-w-[180px]
              "
            >
              <span>Explore Collection</span>

              <ArrowRight
                size={18}
                strokeWidth={2.5}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>

          {/* =================================================
              TRUST INDICATORS
          ================================================= */}

          <div
            className="
              mt-8
              grid
              w-full
              max-w-3xl
              grid-cols-1
              gap-3
              sm:mt-10
              sm:grid-cols-3
              sm:gap-5
            "
          >

            {/* FREE SHIPPING */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                backdrop-blur-sm
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-cyan-400/10
                "
              >
                <Truck
                  size={18}
                  strokeWidth={2}
                  className="text-cyan-300"
                />
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-white">
                  Free Shipping
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  On every order
                </p>
              </div>
            </div>

            {/* WARRANTY */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                backdrop-blur-sm
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-cyan-400/10
                "
              >
                <ShieldCheck
                  size={18}
                  strokeWidth={2}
                  className="text-cyan-300"
                />
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-white">
                  1-Year Warranty
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Premium protection
                </p>
              </div>
            </div>

            {/* SECURE CHECKOUT */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                backdrop-blur-sm
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-cyan-400/10
                "
              >
                <BadgeCheck
                  size={18}
                  strokeWidth={2}
                  className="text-cyan-300"
                />
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-white">
                  Secure Checkout
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Safe & protected
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;