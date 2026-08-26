import {
  ArrowLeft,
  ImagePlus,
  X,
  Save,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";


const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  /* =========================================
     FORM STATE
  ========================================= */

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    brand: "",
    stock: "",
    featured: false,

    processor: "",
    ram: "",
    storage: "",
    display: "",
    graphics: "",
    operatingSystem: "",
    battery: "",
    weight: "",
    color: "",
  });

  /* =========================================
     IMAGES
  ========================================= */

  const [images, setImages] = useState([]);

  const [existingImages, setExistingImages] =
    useState([]);

  /* =========================================
     CATEGORIES
  ========================================= */

  const [categories, setCategories] =
    useState([]);

  /* =========================================
     STATES
  ========================================= */

  const [loading, setLoading] =
    useState(isEditMode);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =========================================
     FETCH CATEGORIES
  ========================================= */

  const fetchCategories = async () => {
    try {
      const response =
        await categoryService.getAllCategories();

      console.log("Categories API Response:", response);

      const categoriesData =
        response?.data?.categories ||
        response?.categories ||
        response?.data ||
        [];

      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to load categories."
      );
    }
  };


  /* =========================================
     FETCH PRODUCT FOR EDIT
  ========================================= */

  const fetchProduct = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await productService.getProductById(id);

      const product =
        response?.data?.product ||
        response?.product ||
        response?.data;

      if (!product) {
        throw new Error(
          "Product not found."
        );
      }

      setFormData({
        name: product.name || "",

        description:
          product.description || "",

        price:
          product.price ?? "",

        compareAtPrice:
          product.compareAtPrice ?? "",

        category:
          product.category?._id ||
          product.category ||
          "",

        brand:
          product.brand || "",

        stock:
          product.stock ?? "",

        featured:
          Boolean(product.featured),

        processor:
          product.specifications?.processor ||
          "",

        ram:
          product.specifications?.ram ||
          "",

        storage:
          product.specifications?.storage ||
          "",

        display:
          product.specifications?.display ||
          "",

        graphics:
          product.specifications?.graphics ||
          "",

        operatingSystem:
          product.specifications?.operatingSystem ||
          "",

        battery:
          product.specifications?.battery ||
          "",

        weight:
          product.specifications?.weight ||
          "",

        color:
          product.specifications?.color ||
          "",
      });

      setExistingImages(
        Array.isArray(product.images)
          ? product.images
          : []
      );

    } catch (error) {
      console.error(
        "Failed to fetch product:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  };


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    fetchCategories();

    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);


  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  };


  /* =========================================
     HANDLE IMAGES
  ========================================= */

  const handleImageChange = (event) => {
    const selectedFiles =
      Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    const totalExisting =
      existingImages.length;

    const totalNew =
      images.length;

    const remainingSlots =
      5 - totalExisting - totalNew;

    if (remainingSlots <= 0) {
      setError(
        "You can upload a maximum of 5 images."
      );

      event.target.value = "";
      return;
    }

    const filesToAdd =
      selectedFiles.slice(
        0,
        remainingSlots
      );

    if (
      selectedFiles.length >
      remainingSlots
    ) {
      setError(
        `Only ${remainingSlots} image(s) can be added. Maximum is 5 images.`
      );
    }

    setImages((current) => [
      ...current,
      ...filesToAdd,
    ]);

    event.target.value = "";
  };


  /* =========================================
     REMOVE NEW IMAGE
  ========================================= */

  const removeNewImage = (index) => {
    setImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };


  /* =========================================
     REMOVE EXISTING IMAGE
     
     NOTE:
     Backend currently replaces all old
     images whenever new images are uploaded.
     So existing image removal is handled
     visually here.
  ========================================= */

  const removeExistingImage = (index) => {
    setExistingImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };


  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* =========================================
       FRONTEND VALIDATION
    ========================================= */

    if (!formData.name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (
      formData.name.trim().length < 3
    ) {
      setError(
        "Product name must be at least 3 characters."
      );
      return;
    }

    if (!formData.description.trim()) {
      setError(
        "Product description is required."
      );
      return;
    }

    if (
      formData.description.trim().length < 20
    ) {
      setError(
        "Description must be at least 20 characters."
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
        "Please select a category."
      );
      return;
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(
        Number(formData.stock)
      ) ||
      Number(formData.stock) < 0
    ) {
      setError(
        "Stock must be a valid non-negative integer."
      );
      return;
    }

    if (
      formData.compareAtPrice !== "" &&
      Number(formData.compareAtPrice) <
      Number(formData.price)
    ) {
      setError(
        "Compare-at price cannot be less than product price."
      );
      return;
    }

    /* =========================================
       IMAGE VALIDATION
    ========================================= */

    if (
      !isEditMode &&
      images.length > 5
    ) {
      setError(
        "You can upload a maximum of 5 images."
      );
      return;
    }

    try {
      setSaving(true);

      /* =========================================
         CREATE FORM DATA
      ========================================= */

      const data = new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "compareAtPrice",
        formData.compareAtPrice
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "brand",
        formData.brand.trim()
      );

      data.append(
        "stock",
        formData.stock
      );

      data.append(
        "featured",
        String(formData.featured)
      );

      /* =========================================
         SPECIFICATIONS
      ========================================= */

      const specifications = {
        processor:
          formData.processor.trim(),

        ram:
          formData.ram.trim(),

        storage:
          formData.storage.trim(),

        display:
          formData.display.trim(),

        graphics:
          formData.graphics.trim(),

        operatingSystem:
          formData.operatingSystem.trim(),

        battery:
          formData.battery.trim(),

        weight:
          formData.weight.trim(),

        color:
          formData.color.trim(),
      };

      data.append(
        "specifications",
        JSON.stringify(
          specifications
        )
      );

      /* =========================================
         IMAGES
      ========================================= */


      data.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      /* =========================================
         NEW IMAGES
      ========================================= */

      images.forEach((image) => {
        data.append("images", image);
      });

      /* =========================================
         API CALL
      ========================================= */

      if (isEditMode) {
        await productService.updateProduct(
          id,
          data
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        await productService.createProduct(
          data
        );

        setSuccess(
          "Product created successfully."
        );
      }

      /* =========================================
         REDIRECT
      ========================================= */

      setTimeout(() => {
        navigate("/admin/products");
      }, 700);

    } catch (error) {
      console.error(
        "Failed to save product:",
        error
      );

      const backendMessage =
        error?.response?.data?.message;

      const validationErrors =
        error?.response?.data?.errors;

      if (
        Array.isArray(validationErrors) &&
        validationErrors.length > 0
      ) {
        setError(
          validationErrors
            .map(
              (item) =>
                item.msg ||
                item.message
            )
            .join(", ")
        );
      } else {
        setError(
          backendMessage ||
          "Failed to save product."
        );
      }
    } finally {
      setSaving(false);
    }
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-cyan-400"
        />
      </div>
    );
  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <section className="space-y-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
          >
            <ArrowLeft size={17} />

            Back to Products
          </button>

          <p className="text-sm font-semibold text-cyan-400">
            NEXORA Administration
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
            {isEditMode
              ? "Edit Product"
              : "Add Product"}
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {isEditMode
              ? "Update your laptop product information."
              : "Add a new laptop product to your NEXORA inventory."}
          </p>

        </div>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          {error}
        </div>
      )}


      {/* =====================================
          SUCCESS
      ===================================== */}

      {success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
          {success}
        </div>
      )}


      {/* =====================================
          FORM
      ===================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ===================================
            BASIC INFORMATION
        =================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-black/10">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-white">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the main information about
              your laptop.
            </p>

          </div>


          <div className="grid gap-5 lg:grid-cols-2">

            {/* Name */}

            <div className="lg:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Product Name
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dell XPS 15"
                maxLength={150}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />

            </div>


            {/* Description */}

            <div className="lg:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Description
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed product description..."
                rows={6}
                maxLength={5000}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />

              <p className="mt-1 text-right text-xs text-slate-600">
                {formData.description.length}/5000
              </p>

            </div>


            {/* Brand */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Dell"
                maxLength={100}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />

            </div>


            {/* Category */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Category
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </div>


        {/* ===================================
            PRICING & INVENTORY
        =================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-black/10">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-white">
              Pricing & Inventory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set product pricing and available
              inventory.
            </p>

          </div>


          <div className="grid gap-5 sm:grid-cols-2">

            {/* Price */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Price (PKR)
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="150000"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />

            </div>


            {/* Compare Price */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Compare-at Price (PKR)
              </label>

              <input
                type="number"
                name="compareAtPrice"
                value={
                  formData.compareAtPrice
                }
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="180000"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />

            </div>


            {/* Stock */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Stock
                <span className="text-red-400">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="10"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />

            </div>


            {/* Featured */}

            <div className="flex items-end">

              <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">

                <input
                  type="checkbox"
                  name="featured"
                  checked={
                    formData.featured
                  }
                  onChange={handleChange}
                  className="h-4 w-4 accent-cyan-500"
                />

                <span>
                  <span className="block text-sm font-semibold text-white">
                    Featured Product
                  </span>

                  <span className="block text-xs text-slate-500">
                    Show this product as featured.
                  </span>
                </span>

              </label>

            </div>

          </div>

        </div>


        {/* ===================================
            PRODUCT IMAGES
        =================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-black/10">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-white">
              Product Images
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload up to 5 product images.
            </p>

          </div>


          {/* Existing Images */}

          {existingImages.length > 0 && (
            <div className="mb-5">

              <p className="mb-3 text-sm font-semibold text-slate-300">
                Existing Images
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                {existingImages.map(
                  (image, index) => (

                    <div
                      key={
                        image.publicId ||
                        index
                      }
                      className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
                    >

                      <img
                        src={
                          image.url
                        }
                        alt={`Product ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X size={15} />
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>
          )}


          {/* New Images */}

          {images.length > 0 && (
            <div className="mb-5">

              <p className="mb-3 text-sm font-semibold text-slate-300">
                New Images
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                {images.map(
                  (image, index) => (

                    <div
                      key={`${image.name}-${index}`}
                      className="group relative overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-900"
                    >

                      <img
                        src={
                          URL.createObjectURL(
                            image
                          )
                        }
                        alt={image.name}
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X size={15} />
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>
          )}


          {/* Upload */}

          {existingImages.length +
            images.length <
            5 && (

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-10 text-center transition hover:border-cyan-500/50 hover:bg-cyan-500/5">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">

                  <ImagePlus size={23} />

                </div>

                <p className="mt-4 text-sm font-semibold text-white">
                  Click to upload images
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPG, WEBP — Maximum 5 images
                </p>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>
            )}

        </div>


        {/* ===================================
            SPECIFICATIONS
        =================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-black/10">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-white">
              Laptop Specifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the technical specifications
              of the laptop.
            </p>

          </div>


          <div className="grid gap-5 sm:grid-cols-2">

            {/* Processor */}

            <InputField
              label="Processor"
              name="processor"
              value={formData.processor}
              onChange={handleChange}
              placeholder="Intel Core i7-13700H"
            />


            {/* RAM */}

            <InputField
              label="RAM"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              placeholder="16GB DDR5"
            />


            {/* Storage */}

            <InputField
              label="Storage"
              name="storage"
              value={formData.storage}
              onChange={handleChange}
              placeholder="512GB SSD"
            />


            {/* Display */}

            <InputField
              label="Display"
              name="display"
              value={formData.display}
              onChange={handleChange}
              placeholder='15.6" FHD IPS'
            />


            {/* Graphics */}

            <InputField
              label="Graphics"
              name="graphics"
              value={formData.graphics}
              onChange={handleChange}
              placeholder="NVIDIA RTX 4060"
            />


            {/* Operating System */}

            <InputField
              label="Operating System"
              name="operatingSystem"
              value={
                formData.operatingSystem
              }
              onChange={handleChange}
              placeholder="Windows 11 Home"
            />


            {/* Battery */}

            <InputField
              label="Battery"
              name="battery"
              value={formData.battery}
              onChange={handleChange}
              placeholder="70Wh"
            />


            {/* Weight */}

            <InputField
              label="Weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="1.8 kg"
            />


            {/* Color */}

            <InputField
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Space Gray"
            />

          </div>

        </div>


        {/* ===================================
            ACTIONS
        =================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                {isEditMode
                  ? "Updating..."
                  : "Creating..."}
              </>
            ) : (
              <>
                <Save size={18} />

                {isEditMode
                  ? "Update Product"
                  : "Create Product"}
              </>
            )}

          </button>

        </div>

      </form>

    </section>
  );
};


/* =========================================
   REUSABLE INPUT
========================================= */

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      />

    </div>
  );
};


export default AdminProductForm;