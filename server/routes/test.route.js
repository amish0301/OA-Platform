const { createTest, assignTest, getAssignedTest } = require("../controller/test.controller");
const useAuth = require("../middleware/isAuth");

const router = require("express").Router();

router.use(useAuth);

router.post('/create/:testId', createTest);
router.post('/assign', assignTest);

router.get('/assigned', getAssignedTest);

module.exports = router