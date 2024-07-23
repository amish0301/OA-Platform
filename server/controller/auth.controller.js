const User = require("../db/user.model");
const { TryCatch, generateTokens, cookieOption } = require("../utils/helper");
const path = require("path");
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

  sendToken(res,201,user,"User created successfully");
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
      message: "User not Exists",
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

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json({
      success: true,
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "Login successfully",
    });
});

module.exports = { registerUser, loginUser };