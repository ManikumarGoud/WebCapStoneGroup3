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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const route = express.Router();

route.post("/register", registerController);
route.get("/logout", logout);
route.get("/ll", getLogin);

route.post("/login", login);

app.use(route);
app.listen(process.env.PORT, () => {
  console.log(`server sucessfully started on PORT ${process.env.PORT}`);
});
