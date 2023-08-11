const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isShipper: {
    type: Boolean,
    default: false,
  },
  isSeller: {
    type: Boolean,
    default: true,
  },
  addressLine1: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
  },
  province: {
    type: String,
  },
  country: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
