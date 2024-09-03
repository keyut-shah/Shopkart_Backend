import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    price: {
      amount: { type: Number, required: true }, // Price amount
      currency: { type: String, default: "INR" }, // Currency code
    },
    discount: {
      amount: { type: Number, default: 0 }, // Discount amount
      percentage: { type: Number, default: 0 }, // Discount percentage
      validFrom: { type: Date }, // Start date of the discount
      validTo: { type: Date }, // End date of the discount
    },
    category: {
      type: String,
      enum: ["Pant", "Shirt", "Dress", "Jacket", "T-shirt", "Suit","Hoodie"],
      required: true,
    }, // Fixed categories
    gender: {
      type: String,
      enum: ["Male", "Female", "Unisex"],
      required: true,
    },
    size: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: true,
    }, // Available sizes
    color: { type: [String] }, // Available colors
    images: { type: [String] }, // Image URLs
    brand: { type: String },
    stock: { type: Number, default: 0 }, // Stock quantity
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      required: true,
    },
    ratings: { type: Number, default: 0 }, // Average rating
    numOfReviews: { type: Number, default: 0 }, // Number of reviews
    reviews: [
      {
        reviewId: { type: mongoose.Schema.Types.ObjectId, auto: true },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
        comment: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ], // Array of reviews
    isPopular: { type: Boolean, default: false }, // Popular product flag
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to owner

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ name: "text", description: "text" }); // Text index for search functionality
productSchema.index({ price: 1 }); // Index for sorting by price
productSchema.index({ ratings: -1 }); // Index for sorting by ratings
productSchema.index({ createdAt: -1 }); // Index for sorting by newest
productSchema.index({ category: 1, gender: 1 }); // Index for filtering by category and gender





const Product = mongoose.model("Product", productSchema);

export default Product;
