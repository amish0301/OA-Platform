const { cookieOption, TryCatch } = require("../utils/helper");
const ApiError = require("../utils/ApiError");
const User = require("../db/user.model");
const jwt = require("jsonwebtoken");
const path = require("path");
const { generateTokens } = require("../controller/auth.controller");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// refresh access token
const refreshAccessToken = TryCatch(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decoded?.id).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiError(401, "Invalid Refresh Token");

  if (incomingToken !== user?.refreshToken)
    throw new ApiError(401, "Refresh token is expired or used");

  // generate new tokens
  const { newAccessToken, newRefreshToken } = await generateTokens(user);
  if (!newAccessToken || !newRefreshToken) {
    throw new ApiError(500, "Token generation failed");
  }

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOption)
    .cookie("refreshToken", newRefreshToken, cookieOption)
    .json({
      success: true,
      message: "Access token refreshed",
    });
});

const logoutUser = TryCatch(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

module.exports = { logoutUser, refreshAccessToken };
