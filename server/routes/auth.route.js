const express = require("express");
const passport = require("passport");
const path = require("path");
const {
  registerUser,
  loginUser,
  refreshAccessToken,
} = require("../controller/auth.controller");
const User = require("../db/user.model");
const { cookieOption } = require("../utils/helper");
const isAuthenticated = require("../middleware/isAuth");
const ApiError = require("../utils/ApiError");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const router = express.Router();

// authenticate user through google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URI}/auth/login/success`,
    failureRedirect: `${process.env.CLIENT_URI}/auth/login/failed`,
  })
);

router.get("/login/success", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const accessToken = await req.user.generateAccessToken();
      const refreshToken = await req.user.generateRefreshToken();
      const user = await User.findById(req.user._id).select("-password -refreshToken");

      // set cookies
      res.cookie(process.env.AUTH_TOKEN, accessToken, cookieOption);
      res.cookie("refreshToken", refreshToken, cookieOption);
      
      return res
        .status(200)
        .json({
          user,
          success: true,
          message: "Login successfully",
          refreshToken,
        });
    } else {
      return res.status(401).json({
        success: false,
        message: "You're Not Authenticated | Google OAuth failed",
      });
    }
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Internal server error" });
  }
});

// login failed
router.get("/login/failed", async (req, res) => {
  return res
    .status(401)
    .json({ success: false, message: "Google Login Failed" });
});

router.get("/logout", isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.uId);
    res.clearCookie(process.env.AUTH_TOKEN, cookieOption);
    res.clearCookie("refreshToken", cookieOption);

    return res
      .status(200)
      .json({ success: true, message: "Logout successfully" });
    // remove user from database
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Credentials Auth Route
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
