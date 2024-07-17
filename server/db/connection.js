const mongoose = require("mongoose");

const connectMongoDB = async (uri) => {
  await mongoose
    .connect(uri)
    .then((data) => {
      console.log(`Connected to DB: ${data.connection.name}`);
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = connectMongoDB;
