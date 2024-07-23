const express = require("express");
const passport = require("passport");
const path = require("path");
const { registerUser, loginUser } = require("../controller/auth.controller");
const User = require("../db/user.model");
const axios = require("axios");
const { cookieOption } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/isAuth");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const router = express.Router();

// authenticate user through google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URI,
    failureRedirect: `${process.env.CLIENT_URI}/auth/login/failed`,
  }),
  (req, res) => {
    // Set the accessToken in a cookie
    res.cookie("accessToken", req.authInfo.accessToken, {
      httpOnly: true, // for security
      secure: process.env.NODE_ENV === "production", // send only over HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 30 days
    });
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
      const user = await User.findOne({ email: req.user._json.email });
      if (user) {
        // generate token
        const token = await user.generateAccessToken();
        // save token in cookie
        res.cookie("accessToken", token, cookieOption);
      } else {
        const newUser = await User.create({
          name: req.user._json.name,
          email: req.user._json.email,
          passpord: Date.now().toString(),
        });

        await newUser.save();
        const token = await newUser.generateAccessToken();
        res.cookie("accessToken", token, cookieOption);
      }

      return res.status(200).json({
        user: { ...req.user, isAdmin: user?.isAdmin, _id: user?._id },
        success: true,
        message: "Login successfully",
      });
    } else {
      // return res
      //   .status(403)
      //   .json({ success: false, message: "Not Authorized" });

      // check for credentials user
      try {
        const token =
          req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token)
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded)
          return res
            .status(401)
            .json({ success: false, message: "Token Expired, Login Again" });

        const user = await User.findById(decoded?.id);
        if (!user)
          return res
            .status(401)
            .json({ success: false, message: "Invalid User" });

        return res
          .status(200)
          .json({ user, success: true, message: "Login successfully" });
      } catch (error) {
        console.log('error in success login route', error);
      }
    }
  } catch (error) {
    console.log("error in success login route", error);
  }
});

// login failed
router.get("/login/failed", async (req, res) => {
  return res
    .status(401)
    .json({ success: false, message: "Google Login Failed" });
});

router.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) console.log("While loggout ", err);
    res.redirect("/");
  });
});

// Credentials Auth Route
router.post("/signup", registerUser);
router.post("/login", loginUser);

module.exports = router;
