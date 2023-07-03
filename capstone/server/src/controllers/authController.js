const User = require("../models/User");
const bcrypt = require("bcrypt");

const getLogin = (req, res) => {
  const { userId } = req.session;
  console.log(userId);
  res.json(userId);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { userId } = req.session;
  if (userId) {
    res.status(202).json(true);
    return;
  } else {
    const errors = {};
    if (!email) {
      errors["email"] = "Email is required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors["email"] = "Email is invalid";
    }

    if (!password) {
      errors["password"] = "Password is required";
    } else if (password.length < 6) {
      errors["password"] = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json(errors);
      return;
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json(false);
      } else {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          req.session.userId = user._id;
          res.status(200).json(true);
        } else {
          res.status(403).json({
            error: "Invalid Credentials. Email and Password didnt match",
          });
        }
      }
    }
  }
};

const logout = (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    res.status(401).json({ error: "Invalid Request" });
  } else {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        req.session = null;
        res.status(200).json(true);
      }
    });
  }
};

module.exports = { login, logout, getLogin };
