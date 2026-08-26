import {
  Zap,
  ShieldCheck,
  Truck,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: Zap,
    title: "Powerful Performance",
    description:
      "Experience fast, responsive performance built for work, creativity, and entertainment.",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Trusted Quality",
    description:
      "Premium materials and carefully engineered technology designed for everyday reliability.",
  },
  {
    id: 3,
    icon: Truck,
    title: "Fast & Secure Delivery",
    description:
      "Get your new laptop delivered safely and efficiently, right to your doorstep.",
  },
  {
    id: 4,
    icon: MessageCircle,
    title: "Dedicated Support",
    description:
      "Our support team is here to help whenever you need us.",
  },
];

const WhyChooseNexora = () => {
  return (
    <section className="relative overflow-hidden bg-black py-12 sm:py-14 md:py-16 lg:py-16">

      {/* =========================================
          DECORATIVE BACKGROUND
      ========================================= */}

      <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl sm:h-80 sm:w-80" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl sm:h-80 sm:w-80" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

      {/* =========================================
          CONTAINER
      ========================================= */}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* =========================================
            SECTION HEADER
        ========================================= */}

        <div className="mx-auto max-w-2xl text-center">

          {/* Small Label */}

          <div className="mb-4 inline-flex items-center gap-2 sm:mb-5">

            <span className="h-px w-6 bg-cyan-400 sm:w-8" />

            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400 sm:text-sm sm:tracking-[0.2em]">
              Why NEXORA
            </span>

            <span className="h-px w-6 bg-cyan-400 sm:w-8" />

          </div>

          {/* Heading */}

          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Why Choose NEXORA?
          </h2>

          {/* Description */}

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7 lg:text-lg">
            Premium technology. Exceptional performance. Designed for you.
          </p>

        </div>

        {/* =========================================
            FEATURE CARDS
        ========================================= */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-4 lg:gap-6">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-5
                  shadow-lg
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-cyan-400/30
                  hover:bg-white/[0.06]
                  hover:shadow-cyan-500/10
                  sm:p-6
                  lg:p-7
                "
              >

                {/* Top Glow */}

                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                {/* Icon */}

                <div
                  className="
                    relative
                    mb-5
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-cyan-400/10
                    bg-cyan-400/10
                    transition-all
                    duration-300
                    group-hover:border-cyan-400/30
                    group-hover:bg-cyan-400
                    sm:mb-6
                    sm:h-14
                    sm:w-14
                    sm:rounded-2xl
                  "
                >
                  <Icon
                    size={24}
                    strokeWidth={2}
                    className="
                      text-cyan-400
                      transition-colors
                      duration-300
                      group-hover:text-black
                      sm:h-[27px]
                      sm:w-[27px]
                    "
                  />
                </div>

                {/* Title */}

                <h3 className="relative text-base font-bold text-white sm:text-lg">
                  {feature.title}
                </h3>

                {/* Description */}

                <p className="relative mt-3 text-sm leading-6 text-gray-400 sm:leading-7">
                  {feature.description}
                </p>

                {/* Bottom Accent */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-5
                    right-5
                    h-0.5
                    origin-left
                    scale-x-0
                    bg-gradient-to-r
                    from-cyan-400
                    to-blue-500
                    transition-transform
                    duration-300
                    group-hover:scale-x-100
                    sm:left-6
                    sm:right-6
                    lg:left-7
                    lg:right-7
                  "
                />

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default WhyChooseNexora;