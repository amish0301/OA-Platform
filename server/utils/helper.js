const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const TryCatch = (fn) => (req, res) => {
  try {
    fn(req, res);
  } catch (error) {
    console.log("error in trycatch helper", error);
  }
};

const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

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

const sendToken = async (res, statusCode, user, message) => {
  try {
    const { accessToken, refreshToken } = await generateTokens(user);

    return res
      .status(statusCode)
      .cookie("accessToken", accessToken, cookieOption)
      .json({
        success: true,
        message,
        accessToken,
      });
  } catch (error) {
    console.log("errr in sendtoken", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  TryCatch,
  cookieOption,
  sendToken,
  generateTokens,
};
