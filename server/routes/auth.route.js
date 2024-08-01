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

    console.log("response from /google route", response);
    res.send(response);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// success login
router.get("/login/success", async (req, res) => {
  try {
    if (req.user) {
      let user = await User.findOne({ email: req.user._json.email });
      let accessToken;

      if (!user) {
        user = await User.create({
          name: req.user._json.name,
          email: req.user._json.email,
          password: Date.now().toString(),
          googleId: req.user._json.sub,
          profileImage: req.user._json.picture,
        });
        await user.save();

        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
      }

      accessToken = await user.generateAccessToken();
      return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", user.refreshToken, cookieOption)
        .json({
          user: {
            name: req.user._json.name,
            email: req.user._json.email,
            googleId: req.user._json.sub,
            profileImage: req.user._json.picture,
          },
          success: true,
          message: "Login successfully",
          accessToken,
        });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "You're Not Authorized" });
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
    const user = await User.findByIdAndDelete(req.uId);
    if(!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.logOut((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, message: err });
      }

      return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({ success: true, message: "Logout successfully" });
    });
  } catch (error) {
    console.error("Logout process error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Credentials Auth Route
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
