const router = require("express").Router();
const {
  createTest,
  assignTest,
  getAssignedTest,
  getTest,
  fetchAllTest,
} = require("../controller/test.controller");
const useAuth = require("../middleware/isAuth");
const { parseData } = require("../middleware/multer");
const { validateTestData } = require("../middleware/validators");

router.use(useAuth);

router.post("/create", parseData, validateTestData, createTest);
router.post("/assign", assignTest);

router.get("/assigned", getAssignedTest);
router.get("/:testId", getTest);
router.get("/", fetchAllTest);

module.exports = router;
