const { cookieOption, TryCatch } = require("../utils/helper");
const ApiError = require("../utils/ApiError");
const User = require("../db/user.model");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// const logoutUser = TryCatch(async (req, res) => {
//   // await User.findByIdAndUpdate(
//   //   req.uId,
//   //   {
//   //     $set: { refreshToken: undefined },
//   //   },
//   //   { new: true }
//   // );

//   await User.findByIdAndDelete(req.uId);
  
//   return res
//     .status(200)
//     .clearCookie("accessToken", cookieOption)
//     .clearCookie("refreshToken", cookieOption)
//     .json({
//       success: true,
//       message: "Logged out successfully",
//     });
// });

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
      return res.status(200).json({
        success: true,
        user
      });
    }
    return res.status(401).json({ success: false, message: "User not found" });
});

module.exports = {  userInfo, changePassword };
