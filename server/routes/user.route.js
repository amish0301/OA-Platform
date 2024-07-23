const express = require("express");
const router = express.Router();

const useAuth = require("../middleware/isAuth");
const {
  logoutUser,
  refreshAccessToken,
  userInfo,
} = require("../controller/user.controller");

router.use(useAuth);

router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", userInfo);

module.exports = router;
