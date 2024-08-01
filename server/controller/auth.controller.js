const User = require("../db/user.model");
const {
  TryCatch,
  generateTokens,
  cookieOption,
  sendToken,
} = require("../utils/helper");
const path = require("path");
const jwt = require("jsonwebtoken");
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
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, message: "Refresh token expired" });

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== refreshToken) {
    res.clearCookie("refreshToken"); // might revoked
    return res
      .status(401)
      .json({ success: false, message: "Invalid Refresh Token" });
  }

  const accessToken = await user.generateAccessToken();

  return res.status(200).cookie("accessToken", accessToken, cookieOption).json({
    success: true,
    message: "Access token refreshed",
    accessToken,
  });
});

module.exports = { registerUser, loginUser, refreshAccessToken };
