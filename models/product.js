const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
    required: [true, "product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "product price must be provided"],
  },
  company: {
    type: String,
    enum: {
      values: ["marcos", "liddy", "ikea", "caressa"],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
