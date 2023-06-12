const mongoose = require("mongoose");
require("dotenv").config;

const db = mongoose.connect(process.env.DB_URI);

mongoose.connection.on("connect", () => {
  console.log("Database is successfully connected");
});

module.exports = db;
