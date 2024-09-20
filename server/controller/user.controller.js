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

  const test = await Test.findById(testId);
  if (!test) return next(new ApiError("Test not found", 404));

  const originalResult = test.questions.map((q) => parseInt(q.answer));

  let score = 0;
  if (Array.isArray(result) && result.length > 0) {
    score = result.reduce((acc, curr, index) => {
      if (originalResult[index] === curr) return acc + 1;
      return acc;
    }, 0);
  }

  // remove urself from assignedTo
  await Test.findByIdAndUpdate(
    testId,
    {
      $pull: { assignedTo: req.uId },
    },
    { new: true }
  );

  // Check if the user has already completed this test
  const userWithCompletedTest = await User.findOne({
    _id: req.uId,
    "completedTests.testId": testId,
  });

  if (userWithCompletedTest) {
    await User.findOneAndUpdate(
      { _id: req.uId, "completedTests.testId": testId },
      {
        $set: {
          "completedTests.$.score": score,
          "completedTests.$.completedAt": new Date(),
        },
      },
      { new: true }
    );
  } else {
    await User.findByIdAndUpdate(
      req.uId,
      {
        $push: {
          completedTests: {
            testId,
            score,
            completedAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

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

const testDashboardData = TryCatch(async (req, res) => {
  const [assignedTests, finishedTests, accuracy] = await Promise.all([
    User.findById(req.uId, "assignedTests")
      .select("assignTests")
      .countDocuments(),
    User.findById(req.uId, "completedTests")
      .select("completedTests")
      .countDocuments(),
    User.aggregate([
      {
        $addFields: {
          accuracy: {
            $cond: {
              if: { $eq: ["$assignedTests", []] },
              then: 0,
              else: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$completedTests", "$assignedTests"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        },
      },
    ]),
  ]);

  if (!accuracy[0].accuracy) {
    accuracy[0].accuracy = 0;
  }
  const stats = {
    assignedTests,
    finishedTests,
    accuracy: accuracy[0].accuracy,
  };

  return res.status(200).json({ success: true, stats });
});

module.exports = {
  userInfo,
  changePassword,
  completedTests,
  submitTest,
  testDashboardData,
};
