const express = require("express");
const router = express.Router();

const useAuth = require("../middleware/isAuth");
const {
  userInfo,
  completedTests,
  submitTest,
  testDashboardData,
  testDashboardTableData,
  getTestResult,
  updateTestStart,
} = require("../controller/user.controller");

router.use(useAuth);

router.get("/completed", completedTests);
router.post('/start-test/:testId', updateTestStart)
router.post("/submit/:testId", submitTest);
router.get('/result/:id', getTestResult)
router.get('/dashboard/stats', testDashboardData)
router.get("/me", userInfo);

router.get('/dashboard/table', testDashboardTableData);
module.exports = router;
