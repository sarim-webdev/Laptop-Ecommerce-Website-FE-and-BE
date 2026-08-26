import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import ProductCard from "../products/ProductCard";
import productService from "../../services/productService";
import Loader from "../common/Loader";

/* =========================================
   FEATURED PRODUCTS
========================================= */

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     FETCH FEATURED PRODUCTS
  ========================================= */

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await productService.getProducts({
        featured: true,
        limit: 3,
      });

      const productData =
        response?.data?.products ||
        response?.products ||
        response?.data ||
        [];

      const featuredProducts = Array.isArray(productData)
        ? productData.slice(0, 3)
        : [];

      setProducts(featuredProducts);
    } catch (error) {
      console.error("Failed to load featured products:", error);

      setProducts([]);

      setError(
        error?.response?.data?.message ||
          "Unable to load featured products."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <section className="relative overflow-hidden bg-black py-12 sm:py-14 md:py-16 lg:py-16">

      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />

      {/* =========================================
          CONTAINER
      ========================================= */}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* =========================================
            SECTION HEADER
        ========================================= */}

        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">

          {/* Label */}

          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-px w-8 bg-cyan-400" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Featured Collection
            </span>

            <span className="h-px w-8 bg-cyan-400" />
          </div>

          {/* Heading */}

          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Explore Our Best{" "}
            <span className="text-cyan-400">
              Laptops
            </span>
          </h2>

          {/* Description */}

          <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base sm:leading-8 lg:text-lg">
            Discover some of our most popular laptops, carefully
            selected for performance, design, and everyday
            productivity.
          </p>
        </div>

        {/* =========================================
            LOADING
        ========================================= */}

        {loading && (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader />
          </div>
        )}

        {/* =========================================
            ERROR
        ========================================= */}

        {!loading && error && (
          <div className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-white/[0.03] px-6 py-10 text-center backdrop-blur-sm sm:px-10">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-lg font-bold text-red-400">
              !
            </div>

            <h3 className="mt-4 text-lg font-bold text-white">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchFeaturedProducts}
              className="
                mt-6
                rounded-xl
                bg-white
                px-6
                py-3
                text-sm
                font-bold
                text-black
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-cyan-400
                hover:shadow-lg
                hover:shadow-cyan-500/20
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* =========================================
            PRODUCTS
        ========================================= */}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">

            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}

          </div>
        )}

        {/* =========================================
            EMPTY STATE
        ========================================= */}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center backdrop-blur-sm sm:px-10">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-2xl">
              💻
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              No featured products available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
              We are currently updating our featured collection.
              Check back soon for our latest laptops.
            </p>

            <Link
              to="/products"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-white
                px-6
                py-3
                text-sm
                font-bold
                text-black
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-cyan-400
                hover:shadow-lg
                hover:shadow-cyan-500/20
              "
            >
              Browse All Products

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}

        {/* =========================================
            VIEW ALL PRODUCTS
        ========================================= */}

        {!loading && products.length > 0 && (
          <div className="mt-10 flex justify-center sm:mt-12">

            <Link
              to="/products"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.05]
                px-7
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-sm
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-400/30
                hover:bg-cyan-400
                hover:text-black
                hover:shadow-lg
                hover:shadow-cyan-500/20
              "
            >
              View All Products

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;