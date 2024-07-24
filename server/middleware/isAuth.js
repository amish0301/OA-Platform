const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const jwt = require("jsonwebtoken");
const User = require("../db/user.model");

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });

    req.uId = user._id;
    next();
  } catch (error) {
    console.log("Error verifying Token", error);
    return res.status(401).json({ success: false, message: "Token Expired" });
  }
};

module.exports = isAuthenticated;
