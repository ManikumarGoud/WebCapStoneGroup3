const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "ID is required"],
  },
  userId: {
    type: String,
    required: [true, "UserID is required"],
  },
  productId: {
    type: String,
    required: [true, "Product Name is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
