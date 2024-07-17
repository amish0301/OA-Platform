const express = require("express");
const passport = require("passport");
const path = require("path");
const { registerUser } = require("../controller/auth.controller");
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
    console.log("Inside auth.route", req.user);
    res.send("Thank you for signing in!");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error logging out");
    }
    res.redirect(successRedirect);
  });
});

// register user
router.post('/login', registerUser);

module.exports = router;