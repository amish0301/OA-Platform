const { createTest } = require("../controller/test.controller");

const router = require("express").Router();

router.post('/create/:testId', createTest);

module.exports = router