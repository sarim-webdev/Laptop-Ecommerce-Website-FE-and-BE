const StatsCard = ({
  title,
  value = 0,
  icon,
  description,
  trend,
  trendType = "neutral",
  loading = false,
}) => {
  /* =========================================
     TREND STYLES
  ========================================= */

  const trendStyles = {
    positive:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",

    negative:
      "border-red-400/20 bg-red-400/10 text-red-400",

    neutral:
      "border-white/10 bg-white/5 text-gray-400",
  };

  /* =========================================
     LOADING STATE
  ========================================= */

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d151f] via-[#0a1119] to-[#060a10] p-6 shadow-2xl shadow-black/30">

        {/* Loading Glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.06] blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">

          <div className="space-y-3">

            <div className="h-4 w-28 animate-pulse rounded-lg bg-white/10" />

            <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />

            <div className="h-3 w-36 animate-pulse rounded-lg bg-white/10" />

          </div>

          <div className="h-14 w-14 animate-pulse rounded-2xl bg-white/10" />

        </div>

      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d151f] via-[#0a1119] to-[#060a10] p-6 shadow-2xl shadow-black/30 transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/20 hover:shadow-cyan-500/[0.08]">

      {/* =========================================
          TOP RIGHT GLOW
      ========================================= */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/[0.07] blur-3xl transition-all duration-500 group-hover:bg-cyan-500/[0.12]" />


      {/* =========================================
          BOTTOM LEFT GLOW
      ========================================= */}

      <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-blue-600/[0.05] blur-3xl" />


      {/* =========================================
          TOP ACCENT LINE
      ========================================= */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-70" />


      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="relative">

        {/* =========================================
            TOP SECTION
        ========================================= */}

        <div className="flex items-start justify-between gap-4">

          {/* =========================================
              TITLE + VALUE
          ========================================= */}

          <div className="min-w-0">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              {title}
            </p>

            <h3 className="mt-3 whitespace-nowrap text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-2xl xl:text-3xl">
              {value}
            </h3>

          </div>


          {/* =========================================
              ICON
          ========================================= */}

          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-400 shadow-lg shadow-cyan-500/5 transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-400/40 group-hover:bg-cyan-400 group-hover:text-black group-hover:shadow-cyan-400/20">

            {/* Icon Glow */}

            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-400/10 blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <span className="relative z-10">
              {icon}
            </span>

          </div>

        </div>


        {/* =========================================
            BOTTOM SECTION
        ========================================= */}

        {(description || trend) && (

          <div className="mt-6 flex flex-wrap items-center gap-3">

            {/* Trend */}

            {trend && (

              <span
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${trendStyles[trendType]}`}
              >

                {trendType === "positive" && (
                  <span className="mr-1">
                    ↑
                  </span>
                )}

                {trendType === "negative" && (
                  <span className="mr-1">
                    ↓
                  </span>
                )}

                {trend}

              </span>

            )}


            {/* Description */}

            {description && (

              <span className="text-xs text-gray-500">
                {description}
              </span>

            )}

          </div>

        )}


        {/* =========================================
            BOTTOM DIVIDER
        ========================================= */}

        <div className="mt-6 h-px w-full bg-gradient-to-r from-cyan-400/30 via-cyan-400/5 to-transparent" />


        {/* =========================================
            CARD FOOTER
        ========================================= */}

        <div className="mt-4 flex items-center justify-between">

          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-600">
            NEXORA Analytics
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />

        </div>

      </div>

    </div>
  );
};

export default StatsCard;