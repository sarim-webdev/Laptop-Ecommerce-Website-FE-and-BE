import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Creative Professional",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "NEXORA has completely changed the way I work. The performance is excellent, the design feels premium, and everything runs smoothly.",
  },
  {
    id: 2,
    name: "Sophia Carter",
    role: "Content Creator",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "I absolutely love my NEXORA laptop. It is fast, reliable, beautifully designed, and handles my creative work without any issues.",
  },
  {
    id: 3,
    name: "Daniel Wilson",
    role: "Software Developer",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    review:
      "The performance is exactly what I needed for development. NEXORA delivers a smooth experience and the build quality is impressive.",
  },
  {
    id: 4,
    name: "Emma Davis",
    role: "Business Professional",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    review:
      "From ordering to delivery, my NEXORA experience was excellent. The laptop looks amazing and performs even better.",
  },
];

/* =========================================
   TESTIMONIAL CARD
========================================= */

const TestimonialCard = ({ testimonial }) => {
  return (
    <article
      className="
        group
        relative
        flex
        w-[290px]
        shrink-0
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        p-5
        shadow-lg
        backdrop-blur-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400/30
        hover:bg-white/[0.06]
        hover:shadow-cyan-500/10
        sm:w-[340px]
        sm:p-6
        lg:w-[370px]
      "
    >

      {/* =========================================
          CARD GLOW
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          bg-cyan-400/10
          opacity-0
          blur-3xl
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      {/* =========================================
          TOP
      ========================================= */}

      <div className="relative flex items-start justify-between gap-3">

        {/* Customer */}

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="
              h-11
              w-11
              shrink-0
              rounded-full
              object-cover
              ring-2
              ring-cyan-400/20
              transition-all
              duration-300
              group-hover:ring-cyan-400/50
              sm:h-12
              sm:w-12
            "
            loading="lazy"
          />

          <div className="min-w-0">

            <h3 className="truncate text-sm font-bold text-white sm:text-base">
              {testimonial.name}
            </h3>

            <p className="mt-0.5 truncate text-xs text-gray-400 sm:text-sm">
              {testimonial.role}
            </p>

          </div>

        </div>

        {/* Quote */}

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
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
            sm:h-10
            sm:w-10
          "
        >
          <Quote
            size={18}
            className="text-cyan-400 transition-colors duration-300 group-hover:text-black"
            fill="currentColor"
          />
        </div>

      </div>

      {/* =========================================
          RATING
      ========================================= */}

      <div
        className="mt-5 flex items-center gap-1"
        aria-label="5 out of 5 stars"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={15}
            className="text-cyan-400 sm:h-4 sm:w-4"
            fill="currentColor"
          />
        ))}
      </div>

      {/* =========================================
          REVIEW
      ========================================= */}

      <p className="relative mt-4 text-sm leading-6 text-gray-300 sm:leading-7">
        “{testimonial.review}”
      </p>

      {/* =========================================
          BOTTOM ACCENT
      ========================================= */}

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
        "
      />

    </article>
  );
};

/* =========================================
   TESTIMONIALS SECTION
========================================= */

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);

  const scrollingTestimonials = [
    ...testimonials,
    ...testimonials,
  ];

  /* =========================================
     PAGE VISIBILITY
  ========================================= */

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-black py-12 sm:py-14 md:py-16 lg:py-16">

      {/* =========================================
          DECORATIVE BACKGROUND
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          h-72
          w-72
          rounded-full
          bg-cyan-500/10
          blur-3xl
          sm:h-80
          sm:w-80
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-10
          h-72
          w-72
          rounded-full
          bg-blue-600/10
          blur-3xl
          sm:h-80
          sm:w-80
        "
      />

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">

          {/* Small Label */}

          <div className="mb-4 inline-flex items-center gap-2 sm:mb-5">

            <span className="h-px w-6 bg-cyan-400 sm:w-8" />

            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400 sm:text-sm sm:tracking-[0.2em]">
              Customer Stories
            </span>

            <span className="h-px w-6 bg-cyan-400 sm:w-8" />

          </div>

          {/* Heading */}

          <h2
            className="
              text-3xl
              font-black
              leading-tight
              tracking-tight
              text-white
              sm:text-4xl
              md:text-5xl
            "
          >
            Loved by People Who Do More.
          </h2>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-gray-400
              sm:text-base
              sm:leading-7
              lg:text-lg
            "
          >
            See what our customers have to say about their NEXORA
            experience.
          </p>

        </div>

      </div>

      {/* =========================================
          SCROLLING TESTIMONIALS
      ========================================= */}

      <div
        className="relative mt-10 overflow-hidden sm:mt-12 lg:mt-14"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >

        {/* Left Fade */}

        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            z-10
            h-full
            w-12
            bg-gradient-to-r
            from-black
            to-transparent
            sm:w-24
            lg:w-32
          "
        />

        {/* Right Fade */}

        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            z-10
            h-full
            w-12
            bg-gradient-to-l
            from-black
            to-transparent
            sm:w-24
            lg:w-32
          "
        />

        {/* Track */}

        <div
          className="flex w-max gap-4 sm:gap-5"
          style={{
            animation: "nexora-testimonials-scroll 32s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {scrollingTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>

      </div>

      {/* =========================================
          SCROLL HINT
      ========================================= */}

      <div className="mt-7 text-center sm:mt-8">

        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-600 sm:text-xs">
          Hover to pause
        </p>

      </div>

      {/* =========================================
          ANIMATION
      ========================================= */}

      <style>{`
        @keyframes nexora-testimonials-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nexora-testimonials-scroll {
            animation: none !important;
          }
        }
      `}</style>

    </section>
  );
};

export default Testimonials;