const express = require("express");
const isAuthenticated = require("../middleware/isAuth");
const { adminLogin } = require("../controller/admin.controller");
const router = express.Router();

router.post('/login', isAuthenticated, adminLogin)

module.exports = router 