const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const jwt = require("jsonwebtoken");
const User = require("../db/user.model");
const ApiError = require("../utils/ApiError");

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not found" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      req.uId = user._id;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token not valid" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = isAuthenticated;
