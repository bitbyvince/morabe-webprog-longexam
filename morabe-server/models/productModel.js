const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [{ type: String }],
    imagePublicIds: [{ type: String }],
    quantity: { type: Number, required: true, min: 0, default: 1 },
    condition: {
      type: String,
      enum: ["new", "used", "like new"],
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
  },
  { timestamps: true },
);

productSchema.index({ productName: "text" });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ status: 1 });

module.exports = mongoose.model("Product", productSchema);
