import { ArrowRight, Award, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="overflow-hidden bg-black py-12 sm:py-14 md:py-16 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">

          {/* =====================================
              IMAGE
          ===================================== */}

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">

            {/* Decorative background */}

            <div
              className="
                absolute
                -left-3
                -top-3
                h-20
                w-20
                rounded-2xl
                bg-cyan-500/10
                sm:-left-5
                sm:-top-5
                sm:h-24
                sm:w-24
                lg:-left-8
                lg:-top-8
              "
            />

            <div
              className="
                absolute
                -bottom-3
                -right-3
                h-24
                w-24
                rounded-2xl
                bg-blue-500/10
                sm:-bottom-5
                sm:-right-5
                sm:h-28
                sm:w-28
                lg:-bottom-8
                lg:-right-8
              "
            />

            {/* Image */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                shadow-2xl
                shadow-black/40
                sm:rounded-3xl
              "
            >
              <img
                src="/images/about-section-image.png"
                alt="NEXORA premium laptop"
                className="
                  h-[360px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-105
                  sm:h-[450px]
                  md:h-[500px]
                  lg:h-[520px]
                  xl:h-[560px]
                "
              />

              {/* Image overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}

            <div
              className="
                absolute
                bottom-4
                left-4
                flex
                items-center
                gap-2.5
                rounded-xl
                border
                border-white/10
                bg-black/85
                px-3
                py-2.5
                shadow-2xl
                backdrop-blur-md
                sm:bottom-6
                sm:left-6
                sm:gap-3
                sm:rounded-2xl
                sm:px-4
                sm:py-3
                lg:bottom-8
                lg:left-8
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
                  sm:h-10
                  sm:w-10
                  sm:rounded-xl
                "
              >
                <Award className="h-4 w-4 text-cyan-400 sm:h-5 sm:w-5" />
              </div>

              <div>
                <p className="text-xs font-bold text-white sm:text-sm">
                  Premium Technology
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">
                  Built for your future
                </p>
              </div>
            </div>
          </div>

          {/* =====================================
              CONTENT
          ===================================== */}

          <div className="w-full">

            {/* Small Label */}

            <div className="mb-4 inline-flex items-center gap-2 sm:mb-5">
              <span className="h-px w-7 bg-cyan-500 sm:w-8" />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-cyan-400
                  sm:text-sm
                  sm:tracking-[0.2em]
                "
              >
                About NEXORA
              </span>
            </div>

            {/* Main Heading */}

            <h2
              className="
                max-w-xl
                text-3xl
                font-black
                leading-[1.08]
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-[2.75rem]
                xl:text-5xl
              "
            >
              Technology Designed

              <span className="block text-cyan-400">
                Around You.
              </span>
            </h2>

            {/* First Paragraph */}

            <p
              className="
                mt-5
                text-sm
                leading-7
                text-gray-300
                sm:mt-6
                sm:text-base
                sm:leading-8
                lg:text-lg
              "
            >
              At NEXORA, we believe technology should empower you, not
              slow you down. That's why we bring together powerful
              performance, premium design, and intelligent features to
              create laptops built for the way you work, create, and live.
            </p>

            {/* Second Paragraph */}

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-gray-300
                sm:mt-5
                sm:text-base
                sm:leading-8
                lg:text-lg
              "
            >
              From everyday productivity to demanding creative workflows
              and immersive gaming, our laptops are carefully designed to
              deliver a smooth, reliable, and exceptional computing
              experience. Every detail is built with performance, quality,
              and your experience in mind.
            </p>

            {/* CTA */}

            <div className="mt-7 sm:mt-8">
              <Link
                to="/products"
                className="
                  group
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-black
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-cyan-400
                  hover:shadow-xl
                  hover:shadow-cyan-500/20
                  sm:w-auto
                "
              >
                <span>Discover Our Story</span>

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </div>

            {/* =================================
                STATS
            ================================= */}

            <div
              className="
                mt-8
                grid
                grid-cols-3
                gap-3
                border-t
                border-white/10
                pt-7
                sm:mt-10
                sm:gap-5
                sm:pt-8
              "
            >

              {/* Stat 1 */}

              <div className="group min-w-0">
                <div
                  className="
                    mb-2
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-cyan-400/10
                    transition-colors
                    group-hover:bg-cyan-400/20
                    sm:mb-3
                    sm:h-10
                    sm:w-10
                    sm:rounded-xl
                  "
                >
                  <Award className="h-4 w-4 text-cyan-400 sm:h-5 sm:w-5" />
                </div>

                <p className="text-xl font-black text-white sm:text-2xl">
                  15+
                </p>

                <p className="mt-1 text-[10px] leading-4 text-gray-400 sm:text-sm">
                  Premium Laptops
                </p>
              </div>

              {/* Stat 2 */}

              <div className="group min-w-0">
                <div
                  className="
                    mb-2
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-cyan-400/10
                    transition-colors
                    group-hover:bg-cyan-400/20
                    sm:mb-3
                    sm:h-10
                    sm:w-10
                    sm:rounded-xl
                  "
                >
                  <Users className="h-4 w-4 text-cyan-400 sm:h-5 sm:w-5" />
                </div>

                <p className="text-xl font-black text-white sm:text-2xl">
                  10K+
                </p>

                <p className="mt-1 text-[10px] leading-4 text-gray-400 sm:text-sm">
                  Happy Customers
                </p>
              </div>

              {/* Stat 3 */}

              <div className="group min-w-0">
                <div
                  className="
                    mb-2
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-cyan-400/10
                    transition-colors
                    group-hover:bg-cyan-400/20
                    sm:mb-3
                    sm:h-10
                    sm:w-10
                    sm:rounded-xl
                  "
                >
                  <Star className="h-4 w-4 fill-current text-cyan-400 sm:h-5 sm:w-5" />
                </div>

                <p className="text-xl font-black text-white sm:text-2xl">
                  4.8/5
                </p>

                <p className="mt-1 text-[10px] leading-4 text-gray-400 sm:text-sm">
                  Average Rating
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;