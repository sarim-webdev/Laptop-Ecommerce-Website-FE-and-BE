import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import productService from "../../services/productService";
import ProductGrid from "../../components/products/ProductGrid";
import Loader from "../../components/common/Loader";

/* =========================================
   PRODUCTS PAGE
========================================= */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     FETCH PRODUCTS
  ========================================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await productService.getProducts();

      const productData =
        response?.data?.products ||
        response?.products ||
        response?.data ||
        [];

      setProducts(
        Array.isArray(productData)
          ? productData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load products. Please try again."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     INITIAL FETCH
  ========================================= */

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main
      className="
        min-h-screen
        bg-black
        text-white
      "
    >
      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-white/10
          bg-black
          px-4
          py-14
          sm:px-6
          sm:py-16
          lg:px-8
          lg:py-20
        "
      >
        {/* Background Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
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
            -bottom-40
            left-1/4
            h-72
            w-72
            rounded-full
            bg-blue-600/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-px
            w-1/2
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-cyan-400/50
            to-transparent
          "
        />

        <div className="relative mx-auto max-w-7xl">
          {/* Eyebrow */}

          <div className="mb-5 flex items-center gap-3">
            <span
              className="
                h-px
                w-8
                bg-cyan-400
              "
            />

            <span
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.22em]
                text-cyan-400
                sm:text-xs
              "
            >
              NEXORA Collection
            </span>
          </div>

          {/* Heading */}

          <h1
            className="
              max-w-3xl
              text-3xl
              font-black
              leading-tight
              tracking-tight
              text-white
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            Explore Our
            <span className="text-cyan-400">
              {" "}Laptops.
            </span>
          </h1>

          {/* Description */}

          <p
            className="
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-slate-400
              sm:text-base
              lg:text-lg
            "
          >
            Discover powerful laptops designed
            for productivity, creativity, gaming,
            and everyday performance.
          </p>

          {/* Small Accent */}

          <div
            className="
              mt-7
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-1
                w-1
                rounded-full
                bg-cyan-400
              "
            />

            <span
              className="
                h-1
                w-8
                rounded-full
                bg-cyan-400
              "
            />

            <span
              className="
                h-1
                w-2
                rounded-full
                bg-cyan-400/40
              "
            />
          </div>
        </div>
      </section>

      {/* =========================================
          CONTENT
      ========================================= */}

      <section
        className="
          relative
          overflow-hidden
          bg-black
          px-4
          py-10
          sm:px-6
          sm:py-12
          lg:px-8
          lg:py-14
        "
      >
        {/* Background Glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-1/3
            h-96
            w-96
            -translate-x-1/2
            rounded-full
            bg-cyan-500/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            right-0
            h-96
            w-96
            translate-x-1/2
            rounded-full
            bg-blue-600/[0.035]
            blur-3xl
          "
        />

        <div className="relative mx-auto max-w-7xl">
          {/* =========================================
              BREADCRUMB
          ========================================= */}

          <div
            className="
              mb-7
              flex
              items-center
              gap-2
              text-sm
            "
          >
            <Link
              to="/"
              className="
                font-medium
                text-slate-500
                transition
                duration-200
                hover:text-cyan-400
              "
            >
              Home
            </Link>

            <span className="text-slate-700">
              /
            </span>

            <span
              className="
                font-semibold
                text-slate-300
              "
            >
              Products
            </span>
          </div>

          {/* =========================================
              RESULTS HEADER
          ========================================= */}

          <div
            className="
              mb-7
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-9
                    w-1
                    rounded-full
                    bg-gradient-to-b
                    from-cyan-400
                    to-blue-500
                  "
                />

                <div>
                  <h2
                    className="
                      text-xl
                      font-black
                      tracking-tight
                      text-white
                    "
                  >
                    All Laptops
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    {products.length}{" "}
                    {products.length === 1
                      ? "product"
                      : "products"}{" "}
                    available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              LOADING
          ========================================= */}

          {loading && (
            <div
              className="
                flex
                min-h-[320px]
                items-center
                justify-center
                rounded-[24px]
                border
                border-white/10
                bg-[#0b0f14]
                shadow-[0_15px_60px_rgba(0,0,0,0.3)]
              "
            >
              <Loader />
            </div>
          )}

          {/* =========================================
              ERROR
          ========================================= */}

          {!loading && error && (
            <div
              className="
                rounded-[24px]
                border
                border-red-500/20
                bg-[#0b0f14]
                px-6
                py-14
                text-center
                shadow-[0_15px_60px_rgba(0,0,0,0.3)]
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  text-xl
                  font-black
                  text-red-400
                "
              >
                !
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-black
                  text-white
                "
              >
                Unable to Load Products
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                {error}
              </p>

              <button
                type="button"
                onClick={fetchProducts}
                className="
                  mt-6
                  rounded-full
                  bg-gradient-to-r
                  from-cyan-500
                  to-cyan-600
                  px-6
                  py-3
                  text-sm
                  font-black
                  text-black
                  shadow-lg
                  shadow-cyan-500/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:from-cyan-400
                  hover:to-blue-500
                  active:translate-y-0
                "
              >
                Try Again
              </button>
            </div>
          )}

          {/* =========================================
              PRODUCTS
          ========================================= */}

          {!loading &&
            !error &&
            products.length > 0 && (
              <ProductGrid
                products={products}
              />
            )}

          {/* =========================================
              EMPTY STATE
          ========================================= */}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div
                className="
                  rounded-[28px]
                  border
                  border-white/10
                  bg-[#0b0f14]
                  px-6
                  py-16
                  text-center
                  shadow-[0_15px_60px_rgba(0,0,0,0.3)]
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-[20px]
                    border
                    border-cyan-400/20
                    bg-cyan-400/10
                    text-2xl
                  "
                >
                  💻
                </div>

                <h3
                  className="
                    mt-5
                    text-xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  No Products Found
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  There are currently no laptops
                  available.
                </p>
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

export default Products;