const Cart = require("../models/Cart");
const Product = require("../models/Products");
const User = require("../models/User");

const getProductList = async (req, res) => {
  try {
    // Retrieve the user ID from the session
    const userId = req.session.userId;

    // Retrieve the list of products added by other users
    let products = [];
    if (userId) {
      products = await Product.find({
        userId: { $ne: userId },
        quantity: { $gt: 0 },
      });
    } else {
      products = await Product.find();
    }

    // Get the cart items for the user
    const cartItems = await Cart.find({ userId });

    // Map cart items to a dictionary for efficient lookup
    const cartItemMap = cartItems.reduce((map, item) => {
      map[item.productId] = item.quantity;
      return map;
    }, {});

    // Add quantity information to each product
    const productListWithQuantity = products.map((product) => {
      const quantityInCart = cartItemMap[product._id.toString()] || 0;
      return {
        ...product.toObject(),
        quantityInCart,
      };
    });

    res.status(200).json(productListWithQuantity);
  } catch (error) {
    console.log("Error retrieving product list:", error);
    res.status(500).json({ error: "Error retrieving product list" });
  }
};

const handleSearch = async (req, res) => {
  try {
    let searchTerm = req.params.search;
    searchTerm = searchTerm.trim();
    const searchRegex = new RegExp(searchTerm, "i");

    // Find products that match the search term in name or desc
    const products = await Product.find({
      $or: [
        { name: { $regex: searchRegex } },
        { desc: { $regex: searchRegex } },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    const products = await Product.find({
      userId: { $eq: userId },
      quantity: { $gt: 0 },
    });
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
    if (!id) {
      res.status(500).json({ error: "Product ID is required" });
      return;
    }
    if (updatedProduct.image.includes("data:image/")) {
      updatedProduct.image = updatedProduct.image.split("base64,")[1];
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

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await Product.findById(id);
    const user = await User.findById(product.userId, {
      _id: 1,
      firstName: 1,
      lastName: 1,
    });

    let quantityInCart = 0;
    const cart = await Cart.findOne({ userId, productId: id }, { quantity: 1 });
    if (cart) {
      quantityInCart = cart.quantity;
    }

    const productWithQuantity = {
      ...product.toObject(),
      quantityInCart,
    };

    res.json({ product: productWithQuantity, user });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
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
  handleSearch,
  getLatestProductList,
  getProductDetails,
};
