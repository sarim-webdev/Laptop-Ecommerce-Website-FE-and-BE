import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  X,
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import productService from "../../services/productService";
import Loader from "../../components/common/Loader";


const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedProduct, setSelectedProduct] =
    useState(null);


  /* =========================================
     FETCH PRODUCTS
  ========================================= */

  const fetchProducts = async () => {
    try {
      setError("");

      const response =
        await productService.getProducts();

      const productsData =
        response?.data?.products ||
        response?.products ||
        response?.data ||
        [];

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    fetchProducts();
  }, []);


  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };


  /* =========================================
     ADD PRODUCT
  ========================================= */

  const handleAddProduct = () => {
    navigate("/admin/products/new");
  };


  /* =========================================
     EDIT PRODUCT
  ========================================= */

  const handleEditProduct = (productId) => {
    navigate(
      `/admin/products/${productId}/edit`
    );
  };


  /* =========================================
     DELETE PRODUCT
  ========================================= */

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await productService.deleteProduct(
        productId
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product._id !== productId
        )
      );

      if (
        selectedProduct?._id === productId
      ) {
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };


  /* =========================================
     SEARCH
  ========================================= */

  const filteredProducts = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) => {
      const name =
        product.name?.toLowerCase() || "";

      const brand =
        product.brand?.toLowerCase() || "";

      const category =
        product.category?.name?.toLowerCase() ||
        product.category?.toLowerCase() ||
        "";

      return (
        name.includes(value) ||
        brand.includes(value) ||
        category.includes(value)
      );
    });
  }, [products, search]);


  /* =========================================
     STOCK STATUS
  ========================================= */

  const getStockStatus = (stock) => {
    const quantity = Number(
      stock || 0
    );

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        className:
          "border-red-400/20 bg-red-400/10 text-red-400",
      };
    }

    if (quantity <= 5) {
      return {
        label: "Low Stock",
        className:
          "border-amber-400/20 bg-amber-400/10 text-amber-400",
      };
    }

    return {
      label: "In Stock",
      className:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    };
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#05080d]">
        <Loader />
      </div>
    );
  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05080d] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

      {/* =====================================
          BACKGROUND GLOWS
      ===================================== */}

      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/[0.05] blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/[0.03] blur-3xl" />


      <div className="relative mx-auto max-w-7xl space-y-6">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              NEXORA ADMINISTRATION
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage your NEXORA laptop inventory
              and products.
            </p>

          </div>


          {/* Header Actions */}

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* Refresh */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0b1119] px-5 py-2.5 text-sm font-semibold text-slate-300 shadow-lg shadow-black/20 transition-all duration-300 hover:border-cyan-400/30 hover:bg-[#101923] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>


            {/* Add Product */}

            <button
              type="button"
              onClick={handleAddProduct}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:bg-cyan-400"
            >

              <Plus size={18} />

              Add Product

            </button>

          </div>

        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3">

            <p className="text-sm font-medium text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProducts}
              className="shrink-0 text-sm font-semibold text-red-400 underline underline-offset-4"
            >
              Retry
            </button>

          </div>
        )}


        {/* =====================================
            STATS
        ===================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


          {/* Total */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Products
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {products.length}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <Package size={22} />
              </div>

            </div>

            <div className="mt-4 h-1 w-12 rounded-full bg-cyan-400" />

          </div>


          {/* In Stock */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  In Stock
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-400">
                  {
                    products.filter(
                      (product) =>
                        Number(
                          product.stock || 0
                        ) > 5
                    ).length
                  }
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <Boxes size={22} />
              </div>

            </div>

            <div className="mt-4 h-1 w-12 rounded-full bg-emerald-400" />

          </div>


          {/* Low Stock */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-amber-400/20">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Low Stock
                </p>

                <p className="mt-2 text-3xl font-black text-amber-400">
                  {
                    products.filter(
                      (product) => {
                        const stock =
                          Number(
                            product.stock ||
                              0
                          );

                        return (
                          stock > 0 &&
                          stock <= 5
                        );
                      }
                    ).length
                  }
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
                <AlertTriangle size={22} />
              </div>

            </div>

            <div className="mt-4 h-1 w-12 rounded-full bg-amber-400" />

          </div>


          {/* Out Of Stock */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-red-400/20">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Out of Stock
                </p>

                <p className="mt-2 text-3xl font-black text-red-400">
                  {
                    products.filter(
                      (product) =>
                        Number(
                          product.stock || 0
                        ) === 0
                    ).length
                  }
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-400">
                <XCircle size={22} />
              </div>

            </div>

            <div className="mt-4 h-1 w-12 rounded-full bg-red-400" />

          </div>

        </div>


        {/* =====================================
            SEARCH
        ===================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20">

          <div>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
              Product Inventory
            </span>

            <h2 className="mt-1 text-lg font-bold text-white">
              Search Products
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Search products by name, brand or category.
            </p>

          </div>


          <div className="relative mt-5">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products by name, brand or category..."
              className="w-full rounded-xl border border-white/10 bg-[#070c12] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
            />

          </div>

        </div>


        {/* =====================================
            PRODUCTS TABLE
        ===================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/30">


          {/* Table Header */}

          <div className="border-b border-white/10 px-6 py-5">

            <div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                NEXORA Inventory
              </span>

              <h2 className="mt-1 text-lg font-bold text-white">
                All Products
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}{" "}
                available
              </p>

            </div>

          </div>


          {filteredProducts.length === 0 ? (

            /* =====================================
               EMPTY STATE
            ===================================== */

            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <Package size={28} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">
                No products found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or add
                a new product.
              </p>

              <button
                type="button"
                onClick={handleAddProduct}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400"
              >
                <Plus size={17} />
                Add Product
              </button>

            </div>

          ) : (

            /* =====================================
               TABLE
            ===================================== */

            <div className="overflow-x-auto">

              <table className="min-w-[1000px] w-full">

                <thead className="border-b border-white/10 bg-white/[0.02]">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Featured
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-white/[0.06]">

                  {filteredProducts.map(
                    (product) => {

                      const stockStatus =
                        getStockStatus(
                          product.stock
                        );

                      const image =
                        product.images?.[0]?.url ||
                        product.images?.[0] ||
                        product.image ||
                        "/images/product-placeholder.jpg";

                      return (

                        <tr
                          key={product._id}
                          className="transition duration-300 hover:bg-white/[0.025]"
                        >

                          {/* Product */}

                          <td className="px-6 py-5">

                            <div className="flex min-w-[280px] items-center gap-4">

                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#070c12]">

                                <img
                                  src={image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                  onError={(event) => {
                                    event.currentTarget.src =
                                      "/images/product-placeholder.jpg";
                                  }}
                                />

                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-semibold text-white">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {product.brand ||
                                    "NEXORA"}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* Category */}

                          <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-400">

                            {product.category?.name ||
                              product.category ||
                              "—"}

                          </td>


                          {/* Price */}

                          <td className="whitespace-nowrap px-6 py-5">

                            <p className="text-sm font-bold text-white">
                              Rs.{" "}
                              {Number(
                                product.price || 0
                              ).toLocaleString()}
                            </p>

                          </td>


                          {/* Stock */}

                          <td className="whitespace-nowrap px-6 py-5">

                            <div className="flex flex-col items-start gap-1">

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
                              >
                                {stockStatus.label}
                              </span>

                              <span className="text-xs text-slate-500">
                                {product.stock || 0}{" "}
                                units
                              </span>

                            </div>

                          </td>


                          {/* Featured */}

                          <td className="whitespace-nowrap px-6 py-5">

                            {product.featured ? (

                              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                                Featured
                              </span>

                            ) : (

                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-slate-500">
                                Standard
                              </span>

                            )}

                          </td>


                          {/* Actions */}

                          <td className="whitespace-nowrap px-6 py-5 text-right">

                            <div className="flex justify-end gap-2">

                              {/* View */}

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedProduct(
                                    product
                                  )
                                }
                                title="View Product"
                                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400"
                              >
                                <Eye size={16} />
                              </button>


                              {/* Edit */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditProduct(
                                    product._id
                                  )
                                }
                                title="Edit Product"
                                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-400"
                              >
                                <Pencil size={16} />
                              </button>


                              {/* Delete */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product._id
                                  )
                                }
                                title="Delete Product"
                                className="inline-flex items-center justify-center rounded-lg border border-red-400/10 bg-red-400/10 p-2 text-red-400 transition hover:border-red-400/30 hover:bg-red-400/20 hover:text-red-300"
                              >
                                <Trash2 size={16} />
                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* =====================================
          PRODUCT DETAILS MODAL
      ===================================== */}

      {selectedProduct && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1119] shadow-2xl shadow-black/60">


            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1119]/95 px-6 py-5 backdrop-blur">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                  NEXORA PRODUCT
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Product Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedProduct.name}
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-500 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-400"
              >
                <X size={20} />
              </button>

            </div>


            {/* Modal Body */}

            <div className="space-y-6 px-6 py-6">


              {/* Main Info */}

              <div className="grid gap-5 sm:grid-cols-2">


                {/* Product */}

                <div className="rounded-2xl border border-white/10 bg-[#070c12] p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product
                  </p>

                  <p className="mt-2 font-bold text-white">
                    {selectedProduct.name}
                  </p>

                </div>


                {/* Brand */}

                <div className="rounded-2xl border border-white/10 bg-[#070c12] p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Brand
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    {selectedProduct.brand ||
                      "NEXORA"}
                  </p>

                </div>


                {/* Price */}

                <div className="rounded-2xl border border-white/10 bg-[#070c12] p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price
                  </p>

                  <p className="mt-2 font-bold text-cyan-400">
                    Rs.{" "}
                    {Number(
                      selectedProduct.price ||
                        0
                    ).toLocaleString()}
                  </p>

                </div>


                {/* Stock */}

                <div className="rounded-2xl border border-white/10 bg-[#070c12] p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stock
                  </p>

                  <p className="mt-2 font-bold text-white">
                    {selectedProduct.stock ||
                      0}{" "}
                    units
                  </p>

                </div>

              </div>


              {/* Description */}

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Description
                </p>

                <div className="mt-2 rounded-2xl border border-white/10 bg-[#070c12] p-5 text-sm leading-7 text-slate-300">
                  {selectedProduct.description ||
                    "No description available."}
                </div>

              </div>


              {/* Specifications */}

              {selectedProduct.specifications &&
                Object.keys(
                  selectedProduct.specifications
                ).length > 0 && (

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Specifications
                    </p>


                    <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">

                      {Object.entries(
                        selectedProduct.specifications
                      ).map(
                        ([key, value]) => (

                          <div
                            key={key}
                            className="grid grid-cols-2 border-b border-white/[0.06] bg-[#070c12] px-4 py-3 last:border-b-0"
                          >

                            <span className="font-medium capitalize text-slate-400">
                              {key.replace(
                                /([A-Z])/g,
                                " $1"
                              )}
                            </span>

                            <span className="text-right font-medium text-white">
                              {String(value)}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

            </div>


            {/* Modal Footer */}

            <div className="flex justify-end border-t border-white/10 bg-[#070c12] px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
};


export default AdminProducts;