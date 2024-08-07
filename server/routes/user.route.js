const express = require("express");
const router = express.Router();

const useAuth = require("../middleware/isAuth");
const {
  userInfo,
} = require("../controller/user.controller");

router.use(useAuth);

// router.get("/logout", logoutUser);
router.get("/me", userInfo);

module.exports = router;
