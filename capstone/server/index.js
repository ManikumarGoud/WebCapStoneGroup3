const express = require("express");
require("dotenv").config();
const session = require("express-session");
const { login, logout, getLogin } = require("./src/controllers/authController");
const registerController = require("./src/controllers/RegisterController");
require("./src/database/db");

const app = express();
app.use(
  session({
    resave: false,
    secret: "ecommersite",
  })
);

const cors = require("cors");
const multer = require("multer");
const authCheck = require("./src/middleware/auth");
const {
  addProduct,
  getProductList,
  getLatestProductList,
  deleteProduct,
  updateProduct,
  getMyProductList,
  getProductDetails,
  handleSearch,
} = require("./src/controllers/productController");
const cartController = require("./src/controllers/cartController");

const {
  getUserProfile,
  updateUserProfile,
} = require("./src/controllers/userController");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
// Multer middleware for handling file uploads
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }).single(
  "image"
);

const route = express.Router();

route.post("/register", registerController);
route.get("/logout", logout);
route.get("/ll", getLogin);

route.post("/login", login);
route.post("/products/add", authCheck, upload, addProduct);
route.get("/products/latest", getLatestProductList);
route.get("/myProducts", getMyProductList);
route.get("/products", getProductList);
route.delete("/products/delete/:id", authCheck, deleteProduct);
route.put("/products/update/:id", authCheck, updateProduct);
route.get("/product/:id", authCheck, getProductDetails);
route.get("/product/search/:search", authCheck, handleSearch);
route.get("/user", authCheck, getUserProfile);
route.post("/user/update", authCheck, updateUserProfile);
route.post("/cart/increase/:id", cartController.increaseQuantity);
route.post("/cart/decrease/:id", cartController.decreaseQuantity);
route.get("/cart", cartController.getAllProducts);
route.post("/checkout", authCheck, cartController.doPayment);
route.delete("/cart/remove/:id", cartController.removeFromCart);

app.use(route);
app.listen(process.env.PORT, () => {
  console.log(`server sucessfully started on PORT ${process.env.PORT}`);
});
