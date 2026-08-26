import { useEffect, useState } from "react";
import { Upload, Plus, Trash2, X, Package } from "lucide-react";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  stock: "",
  featured: false,
  specifications: {},
};

const ProductForm = ({
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState(initialFormState);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [error, setError] = useState("");

  /* =========================================
     EDIT MODE
  ========================================= */

  useEffect(() => {
    if (!initialData) {
      setFormData(initialFormState);
      setSpecifications([]);
      setImages([]);
      setImagePreviews([]);
      return;
    }

    setFormData({
      name: initialData.name || "",
      description: initialData.description || "",
      price: initialData.price ?? "",
      category:
        initialData.category?._id ||
        initialData.category ||
        "",
      brand: initialData.brand || "",
      stock: initialData.stock ?? "",
      featured: Boolean(initialData.featured),
      specifications: initialData.specifications || {},
    });

    const existingSpecifications =
      initialData.specifications || {};

    setSpecifications(
      Object.entries(existingSpecifications).map(
        ([key, value]) => ({
          key,
          value: String(value),
        })
      )
    );

    const existingImages =
      initialData.images || [];

    setImagePreviews(
      existingImages
        .map((image) =>
          typeof image === "string"
            ? image
            : image?.url
        )
        .filter(Boolean)
    );

    setImages([]);
  }, [initialData]);

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
  };

  /* =========================================
     IMAGE CHANGE
  ========================================= */

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (!selectedFiles.length) return;

    if (selectedFiles.length > 5) {
      setError(
        "You can upload a maximum of 5 images."
      );
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) =>
        !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError(
        "Only image files are allowed."
      );
      return;
    }

    setImages(selectedFiles);

    const previews = selectedFiles.map(
      (file) => URL.createObjectURL(file)
    );

    setImagePreviews(previews);

    setError("");
  };

  /* =========================================
     REMOVE IMAGE
  ========================================= */

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setImagePreviews((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  /* =========================================
     SPECIFICATION
  ========================================= */

  const addSpecification = () => {
    setSpecifications((previous) => [
      ...previous,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const updateSpecification = (
    index,
    field,
    value
  ) => {
    setSpecifications((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeSpecification = (index) => {
    setSpecifications((previous) =>
      previous.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError(
        "Product description is required."
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setError(
        "Please enter a valid product price."
      );
      return;
    }

    if (!formData.category) {
      setError(
        "Please select a product category."
      );
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      setError(
        "Please enter a valid stock quantity."
      );
      return;
    }

    /* =========================================
       BUILD SPECIFICATIONS
    ========================================= */

    const specificationsObject = {};

    specifications.forEach(
      ({ key, value }) => {
        const cleanKey = key.trim();

        if (cleanKey) {
          specificationsObject[cleanKey] =
            value.trim();
        }
      }
    );

    /* =========================================
       FORM DATA
    ========================================= */

    const payload = new FormData();

    payload.append(
      "name",
      formData.name.trim()
    );

    payload.append(
      "description",
      formData.description.trim()
    );

    payload.append(
      "price",
      String(Number(formData.price))
    );

    payload.append(
      "category",
      formData.category
    );

    payload.append(
      "brand",
      formData.brand.trim()
    );

    payload.append(
      "stock",
      String(Number(formData.stock))
    );

    payload.append(
      "featured",
      String(formData.featured)
    );

    payload.append(
      "specifications",
      JSON.stringify(
        specificationsObject
      )
    );

    images.forEach((image) => {
      payload.append("images", image);
    });

    try {
      await onSubmit(payload);
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Failed to save product."
      );
    }
  };

  const isEditMode = Boolean(initialData);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =========================================
          BASIC INFORMATION
      ========================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/20">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Package size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditMode
                ? "Edit Product"
                : "Product Information"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Add essential information about
              your NEXORA laptop.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Product Name */}

          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Product Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. NEXORA ProBook X1"
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
            />
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a detailed product description..."
              disabled={loading}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
            />
          </div>
        </div>
      </section>

      {/* =========================================
          PRICING & INVENTORY
      ========================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/20">

        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">
            Pricing & Inventory
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Configure price, category and stock.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Price */}

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {/* Stock */}

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Stock
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {/* Category */}

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => {
                  const categoryId =
                    category?._id ||
                    category?.id;

                  return (
                    <option
                      key={categoryId}
                      value={categoryId}
                    >
                      {category?.name ||
                        category?.title ||
                        "Unnamed Category"}
                    </option>
                  );
                }
              )}
            </select>
          </div>

          {/* Brand */}

          <div>
            <label
              htmlFor="brand"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Brand
            </label>

            <input
              id="brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. NEXORA"
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        {/* Featured */}

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <label className="flex cursor-pointer items-center gap-3">

            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              disabled={loading}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
            />

            <span>
              <span className="block text-sm font-semibold text-white">
                Featured Product
              </span>

              <span className="mt-0.5 block text-xs text-slate-500">
                Show this product in featured
                sections.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* =========================================
          PRODUCT IMAGES
      ========================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/20">

        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">
            Product Images
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Upload up to 5 product images.
          </p>
        </div>

        <label
          htmlFor="images"
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900 px-6 py-10 text-center transition hover:border-cyan-500 hover:bg-cyan-500/5"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
            <Upload size={24} />
          </div>

          <p className="mt-4 text-sm font-semibold text-white">
            Click to upload images
          </p>

          <p className="mt-1 text-xs text-slate-500">
            PNG, JPG, JPEG or WEBP · Max 5 images
          </p>

          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={loading}
            className="hidden"
          />
        </label>

        {/* Preview */}

        {imagePreviews.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

            {imagePreviews.map(
              (preview, index) => (
                <div
                  key={`${preview}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={15} />
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* =========================================
          SPECIFICATIONS
      ========================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/20">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-lg font-bold text-white">
              Specifications
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Add RAM, storage, processor and
              other technical details.
            </p>
          </div>

          <button
            type="button"
            onClick={addSpecification}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            <Plus size={17} />
            Add Specification
          </button>
        </div>

        <div className="mt-6 space-y-3">

          {specifications.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 px-5 py-8 text-center">
              <p className="text-sm font-medium text-slate-400">
                No specifications added.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Click "Add Specification" to add
                product details.
              </p>
            </div>
          )}

          {specifications.map(
            (specification, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row"
              >
                <input
                  type="text"
                  value={specification.key}
                  onChange={(event) =>
                    updateSpecification(
                      index,
                      "key",
                      event.target.value
                    )
                  }
                  placeholder="Key e.g. RAM"
                  disabled={loading}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />

                <input
                  type="text"
                  value={specification.value}
                  onChange={(event) =>
                    updateSpecification(
                      index,
                      "value",
                      event.target.value
                    )
                  }
                  placeholder="Value e.g. 16GB"
                  disabled={loading}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeSpecification(index)
                  }
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      {/* =========================================
          ACTIONS
      ========================================= */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;