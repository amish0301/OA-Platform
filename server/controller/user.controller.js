const { TryCatch } = require("../utils/helper");
const ApiError = require("../utils/ApiError");
const User = require("../db/user.model");
const Test = require("../db/test.model");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const changePassword = TryCatch(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.uId);

  const isMatch = await user.isPasswordCorrect(oldPassword);

  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

const completedTests = TryCatch(async (req, res) => {
  const user = await User.findById(req.uId).select("-password -refreshToken");
  if (!user) return next(new ApiError("User not found", 404));

  const tests = user.completedTests;

  const testData = await Promise.all(
    tests.map(async (test) => {
      const t = await Test.findById(test.testId).select("-assignedTo");
      return {
        test: t,
        score: test.score,
        time: test.completedAt,
      };
    })
  );

  return res.status(200).json({ success: true, testData });
});

const submitTest = TryCatch(async (req, res, next) => {
  const { testId } = req.params;
  const { result } = req.body;

  const user = await User.findById(req.uId).select("-password -refreshToken");
  if (!user) return next(new ApiError("User not found", 404));

  // fetch test and then calculate score
  const test = await Test.findById(testId)
  if (!test) return next(new ApiError("Test not found", 404));

  // remove assignedTo from test
  const filteredTest = test.assignedTo.filter((t) => t.toString() !== testId.toString());
  test.assignedTo = filteredTest;
  await test.save();

  const originalResult = test.questions.map((q) => q.answer);
  const submitedResult = Object.keys(result).map((key) => result[key]);

  const score = originalResult.filter((o, i) => o === submitedResult[i]).length;
  console.log("score", score);

  user.completedTests.push({ testId, score, completedAt: new Date() });
  // might user validate user before saving
  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "Test submitted successfully" });
});

const userInfo = TryCatch(async (req, res) => {
  const user = await User.findById(req.uId).select("-password -refreshToken");
  if (user) {
    return res.status(200).json({
      success: true,
      user,
    });
  }
  return res.status(401).json({ success: false, message: "User not found" });
});

module.exports = { userInfo, changePassword, completedTests, submitTest };
