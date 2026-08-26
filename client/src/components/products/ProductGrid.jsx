import ProductCard from "./ProductCard";

/* =========================================
   PRODUCT GRID
========================================= */

const ProductGrid = ({ products = [] }) => {
  if (!products.length) {
    return null;
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;