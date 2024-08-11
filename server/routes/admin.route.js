const express = require("express");
const isAuthenticated = require("../middleware/isAuth");
const { adminLogin, adminLogout } = require("../controller/admin.controller");
const router = express.Router();

router.use(isAuthenticated);

router.post('/login', adminLogin)
router.get('/logout', adminLogout);

module.exports = router 