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
  const user = await User.findById(req.uId).select("+completedTests");
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
  const { resultArray } = req.body;

  const user = await User.findById(req.uId).select("-password -refreshToken");
  if (!user) return next(new ApiError("User not found", 404));

  const test = await Test.findById(testId);
  if (!test) return next(new ApiError("Test not found", 404));

  const originalResult = test.questions.map((q) => q.answer);

  if (!Array.isArray(resultArray))
    return next(new ApiError("Result is not an array", 400));

  let score = 0;
  resultArray.forEach((r, i) => {
    if (r != null && r != undefined && r === Number(originalResult[i])) {
      score += 1;
    }
  });

  // remove urself from assignedTo
  const testExists = user.completedTests.some(
    (test) => test.testId.toString() === testId
  );

  if (testExists) {
    // Update the existing test's score
    await User.updateOne(
      {
        _id: req.uId,
        "completedTests.testId": testId,
      },
      {
        $set: {
          "completedTests.$.score": score,
          "completedTests.$.completedAt": new Date(),
        },
      }
    );
  } else {
    // Push a new entry into the completedTests array
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

  // for chartData
  const userPerformance = await User.aggregate([
    { $match: { _id: req.uId } },
    { $unwind: "$completedTests" },
    {
      $lookup: {
        from: "tests",
        localField: "completedTests.testId",
        foreignField: "_id",
        as: "test",
      },
    },
    { $unwind: "$test" },
    {
      $group: {
        _id: "$_id",
        totalScore: { $sum: "$completedTests.score" },
        scores: { $push: "$completedTests.score" },
        maxPossibleScore: { $sum: { $size: "$test.questions" } },
        testDates: {
          $addToSet: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completedTests.completedAt",
            },
          },
        },
      },
    },
    // final reduction
    {
      $project: {
        totalScore: 1,
        scores: 1,
        maxPossibleScore: 1,
        testDates: 1,
        performancePercentage: {
          $multiply: [{ $divide: ["$totalScore", "$maxPossibleScore"] }, 100],
        },
      },
    },
  ]);

  //

  if (!accuracy[0].accuracy) {
    accuracy[0].accuracy = 0;
  }

  const stats = {
    assignedTests,
    finishedTests,
    accuracy: accuracy[0].accuracy,
    userPerformanceData: userPerformance[0] || {},
  };

  return res.status(200).json({ success: true, stats });
});

const testDashboardTableData = TryCatch(async (req, res) => {
  const tableData = await User.aggregate([
    {
      $match: {
        _id: req.uId,
      },
    },
    {
      $unwind: "$completedTests",
    },
    {
      $lookup: {
        from: "tests",
        localField: "completedTests.testId",
        foreignField: "_id",
        as: "test",
      },
    },
    {
      $unwind: "$test",
    },
    {
      $sort: {
        "completedTests.completedAt": -1,
      },
    },
    {
      $limit: 50, // limiting to 50 recent test
    },
    {
      $project: {
        completedAt: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$completedTests.completedAt",
          },
        },
        score: "$completedTests.score",
        isPassed: { $gte: ["$completedTests.score", "$test.passingMarks"] },
        name: "$test.name",
        categories: "$test.categories",
      },
    },
  ]);

  return res.status(200).json({ success: true, tableData });
});

const getTestResult = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new ApiError("Test Id is Invalid or Missing", 400));

  const test = await User.findById(req.uId).select("completedTests");

  const testExists = test.completedTests.some(
    (test) => test.testId.toString() === id
  );

  if (!testExists) {
    return next(new ApiError("Test not found", 404));
  }

  const testResult = test.completedTests.filter(
    (test) => test.testId.toString() === id
  );

  const testData = await Test.findById(testResult[0].testId);

  const result = {
    testName: testData.name,
    score: testResult[0].score,
    isPassed: parseInt(testResult[0].score) >= testData.passingMarks,
    completedAt: testResult[0].completedAt,
    totalQuestions: testData.questions.length,
    timeTaken: new Date(testResult[0].completedAt - testData.createdAt).toISOString(),
  }

  return res.status(200).json({
    success: true,
    result
  });
});

module.exports = {
  userInfo,
  changePassword,
  completedTests,
  submitTest,
  testDashboardData,
  testDashboardTableData,
  getTestResult,
};
