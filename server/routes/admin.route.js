const express = require("express");
const isAuthenticated = require("../middleware/isAuth");
const { adminLogin, adminLogout, fetchUsers } = require("../controller/admin.controller");
const router = express.Router();

router.use(isAuthenticated);

router.post('/login', adminLogin)
router.get('/logout', adminLogout);


// fetch All users
router.get('/users', fetchUsers);

module.exports = router 