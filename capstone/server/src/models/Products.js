const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "UserID is required"],
  },
  name: {
    type: String,
    required: [true, "Product Name is required"],
  },
  desc: {
    type: String,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  image: {
    type: String,
    required: [true, "Product Image is required"],
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
