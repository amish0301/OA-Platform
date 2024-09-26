const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const corsOptions = {
  origin: process.env.CLIENT_URI,
  credentials: true,
};

module.exports = { corsOptions };
