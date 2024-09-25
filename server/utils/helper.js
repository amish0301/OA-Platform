const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const TryCatch = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log("error in trycatch helper", error);
    next(error);
  }
};

const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None",
  maxAge: 1000 * 60 * 60 * 6,
};

const generateTokens = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("errr in generatetokens", error);
  }
};

module.exports = {
  TryCatch,
  cookieOption,
  generateTokens,
};
