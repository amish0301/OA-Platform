const express = require("express");
const isAuthenticated = require("../middleware/isAuth");
const { adminLogin, adminLogout, fetchUsers, dashboardStats } = require("../controller/admin.controller");
const router = express.Router();

router.use(isAuthenticated);

router.post('/login', adminLogin)
router.get('/logout', adminLogout);

// fetch All users
router.get('/users', fetchUsers);

// dashboard route
router.get('/dashboard/stats', dashboardStats)

module.exports = router 