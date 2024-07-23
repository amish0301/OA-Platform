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

  if (incomingToken !== user.refreshToken)
    throw new ApiError(401, "Refresh token is expired or used");

  // generate new tokens
  const { accessToken, refreshToken } = await generateTokens(user);
  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Token generation failed");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json({
      success: true,
      message: "Access token refreshed",
      accessToken,
      refreshToken,
    });
});

const logoutUser = TryCatch(async (req, res) => {
  await User.findByIdAndUpdate(
    req.uId,
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

const changePassword = TryCatch(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.uId);

  const isMatch = await user.isPasswordCorrect(oldPassword);

  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

const userInfo = TryCatch(async (req, res) => {
  const user = await User.findById(req.uId).select("-password -refreshToken");
    if (user) {
      res.status(200).json({
        success: true,
        user
      });
    } else {
      res.status(401).json({ success: false, message: "User not found" });
    }
});

module.exports = { logoutUser, refreshAccessToken, userInfo, changePassword };
