const mongoose = require("mongoose");

const connectMongoDB = async (uri) => {
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectMongoDB;
