const User = require("../db/user.model");
const {
  TryCatch,
  generateTokens,
  cookieOption,
  sendToken,
} = require("../utils/helper");
const path = require("path");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  // check if same user email exist or not
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res
      .status(409)
      .json({ success: false, message: "User with email already exists" });
  }

  // create user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User creation failed",
    });
  }

  await user.save();

  sendToken(res, 201, user, "User created successfully");
});

const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not Found with this Email",
    });
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Password is incorrect",
    });
  }

  // generate token
  const { accessToken, refreshToken } = await generateTokens(user);
  if (!accessToken || !refreshToken) {
    return res.status(500).json({
      success: false,
      message: "Token generation failed",
    });
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json({
      success: true,
      user: loggedInUser,
      accessToken,
      message: "Login successfully",
    });
});

const refreshAccessToken = TryCatch(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    await User.findByIdAndDelete(req.uId);
    return res.status(401).json({ success: false, message: "No refresh token" });
  }

  try {
    let decoded;
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError("Invalid Refresh or Expired Refresh Token", 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user
    );

    if (!accessToken || !newRefreshToken) {
      return res.status(400).json({
        success: false,
        message: "Token generation failed", 
      })
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOption)
      .cookie("refreshToken", newRefreshToken, cookieOption)
      .json({
        success: true,
        message: "Access token refreshed",
        accessToken,
      });
  } catch (error) {
    throw new ApiError("Invalid Refresh or Expired Refresh Token", 401);
  }
});

module.exports = { registerUser, loginUser, refreshAccessToken };
