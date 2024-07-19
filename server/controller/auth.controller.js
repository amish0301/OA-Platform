const User = require("../db/user.model");
const { TryCatch, cookieOption } = require("../utils/helper");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const generateTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("errr in generatetokens", error);
  }
};

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

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email or Password is required" });

  // check user in db
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // user found so check password
  const isMatch = user.isPasswordCorrect(password);
  if (!isMatch)
    return res
      .status(401)
      .json({ success: false, message: "Email or Password is incorrect" });

  const { accessToken, refreshToken } = await generateTokens(user);
  if (!accessToken || !refreshToken) {
    return res
      .status(500)
      .json({ success: false, message: "Token generation failed" });
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
      message: "Login successfully",
      user: loggedInUser,
      accessToken,
    });
});

module.exports = { registerUser, loginUser, generateTokens };