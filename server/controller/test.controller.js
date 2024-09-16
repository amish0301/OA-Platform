const mongoose = require("mongoose");
const Test = require("../db/test.model");
const { TryCatch } = require("../utils/helper");
const ApiError = require("../utils/ApiError");

const createTest = TryCatch(async (req, res) => {
  const { name, duration, description, questions, categories } = req.body;

  const test = await Test.create({
    name,
    questions,
    categories,
    duration,
    description,
  });

  await test.save();

  return res
    .status(200)
    .json({ success: true, message: "Test created successfully", test });
});

const assignTest = TryCatch(async (req, res) => {
  const { testId, userIds } = req.body;

  if (!userIds)
    return res
      .status(400)
      .json({ success: false, message: "Please provide user ids" });

  const test = await Test.findByIdAndUpdate(
    testId,
    {
      $addToSet: { assignedTo: { $each: userIds } },
    },
    {
      new: true,
    }
  );

  if (!test)
    return res.status(404).json({ success: false, message: "Test not found" });

  return res.status(200).json({
    success: true,
    message: "Test assigned successfully",
    test,
  });
});

const getAssignedTest = TryCatch(async (req, res) => {
  const tests = await Test.find({ assignedTo: req.uId }).select("-assignedTo");

  return res.status(200).json({
    success: true,
    message: tests.length
      ? "Test fetched successfully"
      : "No test are assigned",
    tests,
  });
});

const getTest = TryCatch(async (req, res,next) => {
  const { testId } = req.params;

  if(!testId) return next(new ApiError('Test Not Found', 404));

  const test = await Test.findById(testId).select("-assignedTo");

  return res.status(200).json({success: true, message: 'Test fetched successfully', test});

});

const fetchAllTest = TryCatch(async (req, res) => {
  const tests = await Test.find();
  return res.status(200).json({
    success: true,
    message: tests.length
      ? "Test fetched successfully"
      : "No test are assigned",
    tests,
  });
});

module.exports = { createTest, getAssignedTest, assignTest, getTest, fetchAllTest };
