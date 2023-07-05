const Product = require("../models/Products");

const getProductList = async (req, res) => {
  try {
    // Retrieve the user ID from the session
    const userId = req.session.userId;

    // Retrieve the list of products added by other users
    let products = [];
    if (userId) {
      products = await Product.find({ userId: { $ne: userId } });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    console.log("Error retrieving product list:", error);
    res.status(500).json({ error: "Error retrieving product list" });
  }
};

const getLatestProductList = async (req, res) => {
  try {
    // Retrieve the user ID from the session
    const userId = req.session.userId;

    // Retrieve the list of products added by other users
    let products = [];
    if (userId) {
      products = await Product.find({ userId: { $ne: userId } })
        .sort({ createdAt: -1 })
        .limit(10);
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    console.log("Error retrieving product list:", error);
    res.status(500).json({ error: "Error retrieving product list" });
  }
};

const getMyProductList = async (req, res) => {
  try {
    // Retrieve the user ID from the session
    const userId = req.session.userId;

    const products = await Product.find({ userId: { $eq: userId } });
    res.status(200).json(products);
  } catch (error) {
    console.log("Error retrieving product list:", error);
    res.status(500).json({ error: "Error retrieving product list" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the product by ID
    const product = await Product.findById({ _id: id });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Delete the product from the database
    await Product.findByIdAndDelete({ _id: id });

    res.status(200).json({ error: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  try {
    if (updatedProduct.image.includes("data:image/jpeg;base64,")) {
      updatedProduct.image = updatedProduct.image.replace(
        "data:image/jpeg;base64,",
        ""
      );
    }
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      updatedProduct,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, desc, price, quantity, image } = req.body;

    // Create an errors object to store validation errors
    const errors = {};

    if (!name) {
      errors.productName = "Product Name is required";
    }

    if (!desc) {
      errors.description = "Description is required";
    }

    if (!price || isNaN(price) || price < 1 || price > 999999999) {
      errors.price = "Price should be between 1 and 999999999 CAD";
    }

    if (!quantity || isNaN(quantity) || quantity < 1 || quantity > 999999999) {
      errors.quantity = "Quantity should be between 1 and 999999999";
    }

    // Check if an image base64 string was provided
    if (!image) {
      errors.image = "Image is required";
    }

    // Check if any validation errors occurred
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // Convert the base64 image to a buffer
    const imageBuffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    // Save the product to the database
    await Product.create({
      userId: req.session.userId,
      name,
      desc,
      price,
      quantity,
      image: imageBuffer.toString("base64"),
    });

    res.status(200).json({ error: "Product added successfully" });
  } catch (error) {
    console.log("Error adding product:", error);
    res.status(500).json({ error: "Error adding product" });
  }
};

module.exports = {
  addProduct,
  getProductList,
  deleteProduct,
  updateProduct,
  getMyProductList,
  getLatestProductList,
};
