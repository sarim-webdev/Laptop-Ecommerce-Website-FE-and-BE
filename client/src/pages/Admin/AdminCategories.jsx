import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  FolderOpen,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import categoryService from "../../services/categoryService";
import Loader from "../../components/common/Loader";


const AdminCategories = () => {
  /* =========================================
     STATE
  ========================================= */

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });


  /* =========================================
     FETCH CATEGORIES
  ========================================= */

  const fetchCategories = async () => {
    try {
      setError("");

      const response =
        await categoryService.getAllCategories();

      const data =
        response?.data?.categories ||
        response?.categories ||
        [];

      setCategories(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load categories:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load categories."
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
    fetchCategories();
  }, []);


  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });

    setEditingId(null);
  };


  /* =========================================
     CREATE / UPDATE CATEGORY
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const categoryName = form.name.trim();

    const categoryDescription =
      form.description.trim();


    /* =========================================
       VALIDATION
    ========================================= */

    if (!categoryName) {
      setError("Category name is required.");
      return;
    }


    try {
      setSaving(true);

      const payload = {
        name: categoryName,
        description: categoryDescription,
      };


      /* =========================================
         UPDATE CATEGORY
      ========================================= */

      if (editingId) {
        const response =
          await categoryService.updateCategory(
            editingId,
            payload
          );

        const updatedCategory =
          response?.data || response?.category;

        setCategories((previous) =>
          previous.map((category) =>
            category._id === editingId
              ? {
                  ...category,
                  ...(updatedCategory || {}),
                  name: categoryName,
                  description:
                    categoryDescription,
                }
              : category
          )
        );

        setSuccess(
          "Category updated successfully."
        );

        resetForm();

        return;
      }


      /* =========================================
         CREATE CATEGORY
      ========================================= */

      const response =
        await categoryService.createCategory(
          payload
        );

      const createdCategory =
        response?.data || response?.category;


      if (createdCategory?._id) {
        setCategories((previous) => [
          createdCategory,
          ...previous,
        ]);
      } else {
        await fetchCategories();
      }


      /* =========================================
         CLEAR FORM
      ========================================= */

      resetForm();

      setSuccess(
        "Category created successfully."
      );

    } catch (err) {
      console.error(
        "Failed to save category:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================
     EDIT CATEGORY
  ========================================= */

  const handleEdit = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",
      description:
        category.description || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =========================================
     CANCEL EDIT
  ========================================= */

  const handleCancelEdit = () => {
    resetForm();

    setError("");
    setSuccess("");
  };


  /* =========================================
     DELETE CATEGORY
  ========================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await categoryService.deleteCategory(id);

      setCategories((previous) =>
        previous.filter(
          (category) => category._id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }

      setSuccess(
        "Category deleted successfully."
      );

    } catch (err) {
      console.error(
        "Failed to delete category:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete category."
      );
    }
  };


  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    await fetchCategories();
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
              Categories
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage product categories for your
              NEXORA laptop store.
            </p>

          </div>


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

        </div>


        {/* =====================================
            ALERTS
        ===================================== */}

        {error && (

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3">

            <div className="flex items-start gap-3">

              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <p className="text-sm font-medium text-red-400">
                {error}
              </p>

            </div>


            <button
              type="button"
              onClick={fetchCategories}
              className="shrink-0 text-sm font-semibold text-red-400 underline"
            >
              Retry
            </button>

          </div>

        )}


        {success && (

          <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">

            <CheckCircle
              size={18}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <p className="text-sm font-medium text-emerald-400">
              {success}
            </p>

          </div>

        )}


        {/* =====================================
            STATS
        ===================================== */}

        <div className="grid gap-4 sm:grid-cols-2">

          {/* Total Categories */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Categories
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {categories.length}
                </p>

              </div>


              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <FolderOpen size={22} />
              </div>

            </div>


            <div className="mt-4 h-1 w-12 rounded-full bg-cyan-400" />

          </div>


          {/* Category Status */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Category Status
                </p>

                <p className="mt-2 text-2xl font-black text-emerald-400">
                  Active
                </p>

              </div>


              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <CheckCircle size={22} />
              </div>

            </div>


            <div className="mt-4 h-1 w-12 rounded-full bg-emerald-400" />

          </div>

        </div>


        {/* =====================================
            CATEGORY FORM
        ===================================== */}

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-2xl shadow-black/30 sm:p-6">

          <div className="mb-6 flex items-start justify-between gap-4">

            <div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Category Management
              </span>

              <h2 className="mt-2 text-xl font-bold text-white">
                {editingId
                  ? "Edit Category"
                  : "Add New Category"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update the selected category."
                  : "Create a category for your laptop products."}
              </p>

            </div>


            {editingId && (

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-500 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-400 disabled:opacity-50"
                title="Cancel Edit"
              >
                <X size={19} />
              </button>

            )}

          </div>


          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >

            {/* CATEGORY NAME */}

            <div>

              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Category Name
              </label>

              <input
                id="category-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Gaming Laptops"
                disabled={saving}
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>


            {/* DESCRIPTION */}

            <div>

              <label
                htmlFor="category-description"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Description
              </label>

              <input
                id="category-description"
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. High-performance laptops for gaming"
                disabled={saving}
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>


            {/* BUTTONS */}

            <div className="flex flex-wrap gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {editingId ? (
                  <Pencil size={17} />
                ) : (
                  <Plus size={17} />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Add Category"}

              </button>


              {editingId && (

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>


        {/* =====================================
            CATEGORIES TABLE
        ===================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/30">

          {/* TABLE HEADER */}

          <div className="border-b border-white/10 px-6 py-5">

            <div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Inventory Structure
              </span>

              <h2 className="mt-1 text-lg font-bold text-white">
                All Categories
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {categories.length}{" "}
                {categories.length === 1
                  ? "category"
                  : "categories"}{" "}
                available
              </p>

            </div>

          </div>


          {/* EMPTY STATE */}

          {categories.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#070c12] text-cyan-400 shadow-lg">
                <FolderOpen size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                No categories found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first category using
                the form above.
              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="min-w-[700px] w-full">

                <thead className="border-b border-white/10 bg-white/[0.02]">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Description
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-white/[0.06]">

                  {categories.map((category) => (

                    <tr
                      key={category._id}
                      className="transition duration-300 hover:bg-white/[0.025]"
                    >

                      {/* CATEGORY */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                            <FolderOpen size={18} />
                          </div>


                          <div>

                            <p className="font-semibold text-white">
                              {category.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              ID: {category._id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* DESCRIPTION */}

                      <td className="max-w-lg px-6 py-5">

                        <p className="text-sm text-slate-400">
                          {category.description ||
                            "No description"}
                        </p>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(category)
                            }
                            title="Edit Category"
                            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-400"
                          >
                            <Pencil size={16} />
                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category._id
                              )
                            }
                            title="Delete Category"
                            className="inline-flex items-center justify-center rounded-lg border border-red-400/10 bg-red-400/10 p-2 text-red-400 transition hover:border-red-400/30 hover:bg-red-400/20 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </section>
  );
};


export default AdminCategories;