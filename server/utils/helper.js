const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../.env")});

const TryCatch = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateToken = (res, user, statusCode, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(statusCode).cookie("token", token, cookieOption).json({
    success: true,
    message,
  });
};

module.exports = { TryCatch, generateToken };
