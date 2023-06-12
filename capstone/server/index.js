const express = require("express");
require("dotenv").config();
const session = require("express-session");
const loginController = require("./src/controllers/loginController");
const registerController = require("./src/controllers/RegisterController");
require("./src/database/db");

const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "ecommersite",
  })
);

const route = express.Router();

route.post("/register", registerController);
route.post("/login", loginController);

app.use(route);
app.listen(process.env.PORT, () => {
  console.log(`server sucessfully started on PORT ${process.env.PORT}`);
});
