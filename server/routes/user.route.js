const express = require("express");
const router = express.Router();

const useAuth = require("../middleware/isAuth");
const {
  logoutUser,
  refreshAccessToken,
} = require("../controller/user.controller");

router.post("/logout", useAuth, logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.use(useAuth);

module.exports = router;
