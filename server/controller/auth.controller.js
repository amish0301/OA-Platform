const User = require("../db/user.model");
const { TryCatch, generateTokens, cookieOption } = require("../utils/helper");
const path = require("path");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const registerUser = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return next(new ApiError("Please fill all the fields", 400));

  // check if same user email exist or not
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ApiError("User with email already exists", 409));
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
    return next(new ApiError("User creation failed", 500));
  }

  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

const loginUser = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ApiError("Please Provide Credentials", 404));

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError("User Not Exist", 404));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Password is Incorrect", 400));
  }

  // generate token
  const { accessToken, refreshToken } = await generateTokens(user);
  if (!accessToken || !refreshToken) {
    return next(new ApiError("Token Generation Failed", 500));
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

const refreshAccessToken = TryCatch(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    await User.findByIdAndDelete(req.uId);
    next(new ApiError("Refresh Token not Found", 401));
  }

  try {
    let decoded;
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return next(
        new ApiError("Invalid refresh token or Expired refresh token", 401)
      );
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user
    );

    if (!accessToken || !newRefreshToken)
      return next(new ApiError("Token Generation Failed", 500));

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
