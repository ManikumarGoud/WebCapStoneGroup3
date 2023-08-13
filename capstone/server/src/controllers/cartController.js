const Cart = require("../models/Cart");
const Product = require("../models/Products");

const increaseQuantity = async (req, res) => {
  const userId = req.session.userId;
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cartItem = await Cart.findOne({ userId, productId });

    if (!cartItem) {
      // If the product is not in the cart, add it
      cartItem = new Cart({
        id: Date.now(),
        userId,
        productId,
        quantity: 1, // Start with quantity 1
        price: product.price,
      });
    } else if (cartItem.quantity < product.quantity) {
      cartItem.quantity++;
    } else {
      return res.status(400).json({ error: "Cannot increase quantity" });
    }

    await cartItem.save();
    return res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error increasing quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const decreaseQuantity = async (req, res) => {
  const userId = req.session.userId;
  const productId = req.params.id;

  try {
    const cartItem = await Cart.findOne({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ error: "Product not in cart" });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      await cartItem.save();
      return res.status(200).json(cartItem);
    } else {
      return res.status(400).json({ error: "Cannot decrease quantity" });
    }
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.session.userId }).populate(
      "productId"
    );

    const productPromises = cartItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      const totalPrice = (item.quantity * product.price).toFixed(2);

      return {
        id: product._id,
        name: product.name,
        desc: product.desc,
        quantity: item.quantity,
        price: product.price,
        totalPrice,
        image: product.image,
      };
    });

    const productsList = await Promise.all(productPromises);

    res.status(200).json(productsList);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.session.userId;
  const productId = req.params.id;

  try {
    const cartItem = await Cart.findOneAndDelete({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ error: "Product not in cart" });
    }
    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const doPayment = async (req, res) => {
  try {
    const userId = req.session.userId;
    const cartItems = await Cart.find({ userId }).select("productId quantity");

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "No items in the cart" });
    }

    const productIds = cartItems.map((item) => item.productId);

    // Get products from the cart
    const cartProducts = await Cart.find({ productId: { $in: productIds } });

    // Update product quantities and delete from cart
    const productUpdates = cartProducts.map(async (cartProduct) => {
      const product = await Product.findById(cartProduct.productId);

      if (product) {
        // Reduce the product quantity by the cart item quantity
        product.quantity -= cartProduct.quantity;
        await product.save();

        // Delete the product from the cart
        await Cart.findByIdAndRemove(cartProduct._id);
      }
    });

    await Promise.all(productUpdates);

    return res.json({ message: "Payment successful" });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Payment failed" });
  }
};

module.exports = {
  increaseQuantity,
  decreaseQuantity,
  getAllProducts,
  removeFromCart,
  doPayment,
};
