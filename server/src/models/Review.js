import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/*
   One user can review a product only once.
*/

reviewSchema.index(
  {
    product: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;