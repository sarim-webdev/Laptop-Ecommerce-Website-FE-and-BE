import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const specificationSchema = new mongoose.Schema(
  {
    processor: {
      type: String,
      trim: true,
    },

    ram: {
      type: String,
      trim: true,
    },

    storage: {
      type: String,
      trim: true,
    },

    display: {
      type: String,
      trim: true,
    },

    graphics: {
      type: String,
      trim: true,
    },

    operatingSystem: {
      type: String,
      trim: true,
    },

    battery: {
      type: String,
      trim: true,
    },

    weight: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 3,
      maxlength: 150,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
      index: true,
    },

    brand: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
      index: true,
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: 0,
      default: 0,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    specifications: {
      type: specificationSchema,
      default: {},
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    numReviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;