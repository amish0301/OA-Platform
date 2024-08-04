const { createTest, assignTest } = require("../controller/test.controller");

const router = require("express").Router();

router.post('/create/:testId', createTest);
router.post('/assign', assignTest);

module.exports = router