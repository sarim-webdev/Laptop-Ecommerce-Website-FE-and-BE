import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  ArrowUpRight,
} from "lucide-react";

import useCart from "../../hooks/useCart";

/* =========================================
   PRODUCT CARD
========================================= */

const ProductCard = ({ product }) => {
  const {
    addToCart,
    loading: cartLoading,
  } = useCart();

  /* =========================================
     PRODUCT DATA
  ========================================= */

  const {
    _id,
    name,
    description,
    price,
    oldPrice,
    image,
    imageUrl,
    images = [],
    category,
    brand,
    stock = 0,
    rating,
    reviews,
  } = product || {};

  /* =========================================
     PRODUCT IMAGE
  ========================================= */

  const productImage =
    image ||
    imageUrl ||
    images?.[0]?.url ||
    images?.[0] ||
    "/images/product-placeholder.jpg";

  /* =========================================
     STOCK
  ========================================= */

  const isOutOfStock =
    Number(stock) <= 0;

  /* =========================================
     DISCOUNT
  ========================================= */

  const hasDiscount =
    oldPrice &&
    Number(oldPrice) > Number(price);

  const discountPercentage = hasDiscount
    ? Math.round(
      ((Number(oldPrice) - Number(price)) /
        Number(oldPrice)) *
      100
    )
    : 0;

  /* =========================================
     ADD TO CART
  ========================================= */

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      isOutOfStock ||
      cartLoading ||
      !_id
    ) {
      return;
    }

    try {
      await addToCart(_id, 1);
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <article
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.08]
        bg-white/[0.035]
        shadow-xl
        shadow-black/20
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-cyan-400/25
        hover:bg-white/[0.055]
        hover:shadow-2xl
        hover:shadow-cyan-500/[0.08]
      "
    >

      {/* =========================================
          PRODUCT IMAGE
      ========================================= */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-white/[0.07]
          via-white/[0.025]
          to-transparent
        "
      >

        {/* Image Glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-48
            w-48
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-500/[0.07]
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-cyan-400/[0.12]
          "
        />

        {/* Discount Badge */}

        {hasDiscount && (
          <span
            className="
              absolute
              left-4
              top-4
              z-10
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-400/10
              px-3
              py-1.5
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-cyan-400
              backdrop-blur-md
            "
          >
            -{discountPercentage}%
          </span>
        )}

        {/* Stock Badge */}

        {isOutOfStock && (
          <span
            className="
              absolute
              right-4
              top-4
              z-10
              rounded-full
              border
              border-red-400/20
              bg-red-500/10
              px-3
              py-1.5
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-red-400
              backdrop-blur-md
            "
          >
            Out of Stock
          </span>
        )}

        {/* Product Image */}

        <Link
          to={`/products/${_id}`}
          className="
           group
           relative
           block
           h-[280px]
           w-full
           overflow-hidden
           bg-[#080d14]
           sm:h-[320px]
  "
        >
          <img
            src={productImage}
            alt={name || "NEXORA Laptop"}
            loading="lazy"
            className="
            h-full
            w-full
            object-cover
            object-center
            transition-transform
            duration-700
            ease-out
            group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.src =
                "/images/product-placeholder.jpg";
            }}
          />
        </Link>


        {/* View Product Button */}

        <Link
          to={`/products/${_id}`}
          className="
            absolute
            bottom-4
            right-4
            flex
            h-10
            w-10
            translate-y-2
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-black/60
            text-gray-300
            opacity-0
            backdrop-blur-md
            transition-all
            duration-300
            hover:border-cyan-400/30
            hover:bg-cyan-400
            hover:text-black
            group-hover:translate-y-0
            group-hover:opacity-100
          "
          aria-label={`View ${name || "product"}`}
        >
          <ArrowUpRight
            size={18}
            strokeWidth={2.2}
          />
        </Link>

      </div>

      {/* =========================================
          PRODUCT INFORMATION
      ========================================= */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-5
          sm:p-6
        "
      >

        {/* Category */}

        {category && (
          <span
            className="
              mb-3
              w-fit
              rounded-full
              border
              border-cyan-400/15
              bg-cyan-400/[0.07]
              px-2.5
              py-1
              text-[9px]
              font-black
              uppercase
              tracking-[0.15em]
              text-cyan-400
            "
          >
            {typeof category === "object"
              ? category.name
              : category}
          </span>
        )}

        {/* Product Name */}

        <Link
          to={`/products/${_id}`}
          className="
            line-clamp-2
            text-lg
            font-black
            leading-6
            text-white
            transition-colors
            duration-300
            hover:text-cyan-400
          "
        >
          {name || "NEXORA Laptop"}
        </Link>

        {/* Brand */}

        {brand && (
          <p
            className="
              mt-1.5
              text-xs
              font-medium
              text-gray-500
            "
          >
            {brand}
          </p>
        )}

        {/* Description */}

        {description && (
          <p
            className="
              mt-3
              line-clamp-2
              text-sm
              leading-6
              text-gray-500
            "
          >
            {description}
          </p>
        )}

        {/* Rating */}

        {rating !== undefined && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                items-center
                gap-0.5
                text-cyan-400
              "
            >
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  size={13}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>

            <span
              className="
                text-xs
                font-bold
                text-gray-300
              "
            >
              {Number(rating).toFixed(1)}
            </span>

            {reviews !== undefined && (
              <span
                className="
                  text-xs
                  text-gray-600
                "
              >
                ({reviews})
              </span>
            )}

          </div>
        )}

        {/* Spacer */}

        <div className="flex-1" />

        {/* Divider */}

        <div
          className="
            my-5
            border-t
            border-white/[0.07]
          "
        />

        {/* Price + Cart */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-3
          "
        >

          {/* Price */}

          <div>

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-gray-600
              "
            >
              Price
            </p>

            <div
              className="
                mt-1
                flex
                items-baseline
                gap-2
              "
            >

              <span
                className="
                  text-xl
                  font-black
                  text-white
                "
              >
                $
                {Number(
                  price || 0
                ).toLocaleString()}
              </span>

              {hasDiscount && (
                <span
                  className="
                    text-xs
                    font-medium
                    text-gray-600
                    line-through
                  "
                >
                  $
                  {Number(
                    oldPrice
                  ).toLocaleString()}
                </span>
              )}

            </div>

          </div>

          {/* Add To Cart */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              isOutOfStock ||
              cartLoading
            }
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              px-4
              text-xs
              font-black
              text-white
              shadow-lg
              shadow-cyan-500/10
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:from-cyan-400
              hover:to-blue-500
              hover:shadow-cyan-500/20
              active:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label={`Add ${name || "product"} to cart`}
          >
            <ShoppingCart
              size={16}
              strokeWidth={2.5}
            />

            <span className="hidden sm:inline">
              {cartLoading
                ? "Adding..."
                : "Add"}
            </span>
          </button>

        </div>

        {/* Stock */}

        <div className="mt-3">

          {isOutOfStock ? (
            <p
              className="
                text-xs
                font-semibold
                text-red-400
              "
            >
              Currently unavailable
            </p>
          ) : (
            <p
              className="
                text-xs
                font-semibold
                text-emerald-400
              "
            >
              {stock} units available
            </p>
          )}

        </div>

      </div>

      {/* =========================================
          BOTTOM ACCENT
      ========================================= */}

      <div
        className="
          absolute
          bottom-0
          left-6
          right-6
          h-px
          origin-left
          scale-x-0
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-transparent
          transition-transform
          duration-500
          group-hover:scale-x-100
        "
      />

    </article>
  );
};

export default ProductCard;