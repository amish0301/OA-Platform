const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const TryCatch = (fn) => (req, res) => {
  try {
    fn(req, res);
  } catch (error) {
    console.log("error in trycatch helper", error);
  }
};

const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const generateAccessToken = TryCatch((user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
});

const generateRefreshToken = TryCatch((user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
});

module.exports = {
  TryCatch,
  cookieOption,
  generateAccessToken,
  generateRefreshToken,
};
