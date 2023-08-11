const moment = require("moment");
const User = require("../models/User");

const updateUserProfile = (req, res) => {
  const id = req.session.userId;

  if (!id) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  let {
    firstName,
    lastName,
    dob,
    addressLine1,
    addressLine2,
    city,
    country,
    province,
    profilePicture,
    phoneNumber,
  } = req.body;
  const error = {};

  // Validate First Name
  if (!firstName) {
    error["firstName"] = "First Name is required";
  } else if (!/^[A-Za-z ]+$/.test(firstName)) {
    error["firstName"] = "First Name should contain only alphabets";
  }

  // Validate Last Name
  if (!lastName) {
    error["lastName"] = "Last Name is required";
  } else if (!/^[A-Za-z ]+$/.test(lastName)) {
    error["lastName"] = "Last Name should contain only alphabets";
  }

  // Validate Date of Birth
  if (!moment(dob).isValid()) {
    error["dob"] = "Invalid Date of Birth";
  }

  // Validate Address Line 1
  if (!addressLine1) {
    error["addressLine1"] = "Address Line 1 is required";
  } else if (!/^[\w\s/-]+$/.test(addressLine1)) {
    error["addressLine1"] = "Address Line 1 should be 3 and 50 char and, -,/";
  } else if (addressLine1.length < 3 || addressLine1.length > 50) {
    error["addressLine1"] = "Address Line 1 must be between 3 and 50 char";
  }

  // Validate Address Line 2
  if (
    addressLine2 &&
    (!/^[\w\s/-]+$/.test(addressLine2) ||
      addressLine2.length < 3 ||
      addressLine2.length > 50)
  ) {
    error["addressLine2"] = "Address Line 2 should be 3 and 50 char and, -,/";
  }

  // Validate City
  if (!city) {
    error["city"] = "City is required";
  } else if (!/^[A-Za-z ]+$/.test(city)) {
    error["city"] = "City should contain only alphabets";
  } else if (city.length < 3 || city.length > 50) {
    error["city"] = "City should be between 3 and 50 chars";
  }

  // Validate Province
  if (!province) {
    error["province"] = "Province is required";
  } else if (!/^[A-Za-z ]+$/.test(province)) {
    error["province"] = "Province should contain only alphabets";
  } else if (province.length < 3 || province.length > 50) {
    error["province"] = "Province should be between 3 and 50 chars";
  }

  // Validate Country
  if (!country) {
    error["country"] = "Country is required";
  } else if (!/^[A-Za-z ]+$/.test(country)) {
    error["country"] = "Country should contain only alphabets";
  } else if (country.length < 3 || country.length > 50) {
    error["country"] = "Country should be between 3 and 50 chars";
  }

  // Validate Phone Number
  if (!phoneNumber) {
    error["phoneNumber"] = "Phone Number is required";
  } else if (!/^[1-9]\d{2}-\d{3}-\d{4}$/.test(phoneNumber)) {
    error["phoneNumber"] =
      "Invalid Phone Number format. Should be XXX-XXX-XXXX";
  }

  // Validate Profile Picture (Assuming profilePicture is a URL)
  if (!profilePicture) {
    error["profilePicture"] = "Profile Picture is required";
  } else {
    if (profilePicture.includes("data:image/")) {
      profilePicture = profilePicture.replace("data:image/,", "");
    }
  }

  if (Object.keys(error).length > 0) {
    res.status(401).json(error);
    return;
  }

  // Proceed with saving the data or performing other actions

  User.findById({ _id: id })
    .then((user) => {
      if (user !== null) {
        User.findByIdAndUpdate(
          { _id: id },
          {
            firstName,
            lastName,
            dob,
            phoneNumber,
            addressLine1,
            addressLine2,
            city,
            province,
            country,
            phoneNumber,
            profilePicture,
          },
          { new: true }
        )
          .then(() => {
            res.json(true);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Server Error" });
          });
      } else {
        error["error"] = "User Does not Exists";
        res.status(401).json(error);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server Error", code: 500 });
    });
};

const getUserProfile = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(402).json({ error: "Session Expired" });
    return;
  }
  const user = await User.findById(
    { _id: userId },
    {
      firstName: 1,
      lastName: 1,
      addressLine1: 1,
      addressLine: 2,
      country: 1,
      city: 1,
      dob: 1,
      province: 1,
      phoneNumber: 1,
      profilePicture: 1,
      email: 1,
    }
  );

  if (!user) {
    res.status(401).json({ error: "Invalid User ID" });
  } else {
    res.status(200).json(user);
  }
};

module.exports = { updateUserProfile, getUserProfile };
