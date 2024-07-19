const express = require("express");
const passport = require("passport");
const path = require("path");
const { registerUser, loginUser } = require("../controller/auth.controller");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const router = express.Router();
const successRedirect = process.env.CLIENT_URI;
const failureRedirect = `${successRedirect}/auth/login`;

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// Google callback url
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failureRedirect,
    failureMessage: "Cannot login to Google, please try again",
    successRedirect: successRedirect,
    successMessage: "Login success",
  }),
  (req, res) => {
    res.send("Login success");
    console.log('inside call back controller');
  }
);

// auth
router.post("/signup", registerUser);
router.post("/login", loginUser);

module.exports = router;
