const User = require("../models/User");
const bcrypt = require("bcrypt");

const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  const { userId } = req.session;

  if (userId !== null && typeof userId === "string") {
    res.json(true);
  } else {
    const error = {};

    if (!email) {
      error["email"] = "Email is required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      error["email"] = "Email is invalid";
    }

    if (!password) {
      error["password"] = "Password is required";
    } else if (password.length < 6) {
      error["password"] = "Password must be at least 6 characters long";
    }

    if (Object.keys(error).length > 0) {
      res.json({ error });
    } else {
      const user = await User.findOne({ email });

      if (!user) {
        res.json(false);
      } else {
        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
          req.session.userId = user._id;
          res.json(true);
        } else {
          res.json({ messgae: "Invalid Email or Password", code: 403 });
        }
      }
    }
  }
};

module.exports = loginController;
