const express = require("express");
const passport = require("passport");
const path = require("path");
const {
  registerUser,
  loginUser,
  refreshAccessToken,
} = require("../controller/auth.controller");
const User = require("../db/user.model");
const axios = require("axios");
const { cookieOption } = require("../utils/helper");
const isAuthenticated = require("../middleware/isAuth");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const router = express.Router();

// authenticate user through google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URI}/auth/login/success`,
    failureRedirect: `${process.env.CLIENT_URI}/auth/login/failed`,
  }),
  (req, res) => {
    res.redirect(successRedirect);
  }
);

// forward req. to google's authentication server
router.get("/google", async (req, res) => {
  try {
    const response = await axios.get(
      "https://accounts.google.com/o/oauth2/v2/auth",
      {
        params: req.query,
      }
    );
    res.send(response);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// success login
router.get("/login/success", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const accessToken = await req.user.generateAccessToken();
      const refreshToken = req.user.refreshToken;

      return res
        .status(200)
        .cookie(process.env.AUTH_TOKEN, accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json({
          user: req.user,
          success: true,
          message: "Login successfully",
          refreshToken,
        });
    } else {
      return res.status(403).json({
        success: false,
        message: "You're Not Authenticated | Google OAuth failed",
      });
    }
  } catch (error) {
    return res
      .status(500)
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
    req.logOut((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err });
      }
      return res
        .status(200)
        .clearCookie(process.env.AUTH_TOKEN)
        .clearCookie("refreshToken")
        .json({ success: true, message: "Logout successfully" });
    });

    // remove user from database
    await User.findByIdAndDelete(req.uId);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Credentials Auth Route
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
