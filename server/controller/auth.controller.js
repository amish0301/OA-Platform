const User = require("../db/user.model");
const {
  TryCatch,
  generateTokens,
  cookieOption,
} = require("../utils/helper");
const path = require("path");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
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

  // hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User creation failed",
    });
  }

  await user.save();

  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
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

  const isMatch = await bcrypt.compare(password, user.password);
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
    .cookie(process.env.AUTH_TOKEN, accessToken, cookieOption)
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
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  try {
    let decoded;
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token or Expired refresh token",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user
    );

    if (!accessToken || !newRefreshToken) {
      return res.status(400).json({
        success: false,
        message: "Token generation failed",
      });
    }

    return res
      .status(200)
      .cookie(process.env.AUTH_TOKEN, accessToken, cookieOption)
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
