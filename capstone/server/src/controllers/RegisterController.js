const moment = require("moment");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const registerController = async (req, resp, next) => {
  const { firstName, lastName, email, password, confirmPassword, dob } =
    req.body;
  const error = {};
  if (!firstName) {
    error["firstName"] = "First Name is required";
  } else if (firstName.length < 3) {
    error["firstName"] = "First Name cannot be less than 3 characters";
  }

  if (!lastName) {
    error["lastName"] = "Last Name is required";
  } else if (lastName.length < 3) {
    error["lastName"] = "Last Name cannot be less than 3 characters";
  }

  if (!email) {
    error["email"] = "Email is required";
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    error["email"] = "Email is Invalid";
  }

  if (!password) {
    error["password"] = "Password is required";
  } else if (password.length < 6) {
    error["password"] = "Password cannot be less than 6 characters";
  }

  if (!confirmPassword) {
    error["confirmPassword"] = "Confirm Password is required";
  } else if (confirmPassword !== password) {
    error["confirmPassword"] = "Passwords did not match";
  }

  if (!moment(dob).isValid()) {
    error["dob"] = "Invalid Date of Birth";
  }
  if (Object.keys(error).length > 0) {
    resp.status(401).json(error);
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user !== null) {
        error["email"] = "Email Already Exists";
        resp.status(401).json(error);
      } else {
        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            User.create({
              firstName,
              lastName,
              email,
              dob,
              password: hashedPassword,
            })
              .then(() => {
                resp.json(true);
              })
              .catch((err) => {
                console.log(err);

                resp.status(500).json({ error: "Server Error" });
              });
          })
          .catch((err) => {
            console.log(err);

            resp.status(500).json({ error: "Server Error" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      resp.status(500).json({ message: "Server Error", code: 500 });
    });
};

module.exports = registerController;
