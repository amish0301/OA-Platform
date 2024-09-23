const { TryCatch } = require("../utils/helper");
const ApiError = require("../utils/ApiError");
const User = require("../db/user.model");
const Test = require("../db/test.model");
const path = require("path");
const moment = require("moment");
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
  const user = await User.findById(req.uId).select("-password -refreshToken").lean();
  if (!user) return next(new ApiError("User not found", 404));

  const testIds = user.completedTests.map((test) => test.testId);
  const testsData = await Test.find({ _id: { $in: testIds } }).select("-assignedTo").lean();

  const testData = user.completedTests.map((test) => {
    const t = testsData.find((t) => t._id.toString() === test.testId.toString());
    return {
      test: t,
      score: test.score,
      time: test.completedAt,
    };
  });

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
  await Test.findByIdAndUpdate(
    testId,
    { $pull: { assignedTo: req.uId } },
    { new: true }
  );

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
    // Push a new entry into the completedTests array & update totalAssignedTests count
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
        $addToSet: {
          totalAssignedTests: testId,
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
    User.aggregate([
      {
        $match: { _id: req.uId },
      },
      {
        $project: {
          len: { $size: "$totalAssignedTests" },
        },
      },
    ]),
    User.aggregate([
      {
        $match: { _id: req.uId },
      },
      {
        $project: {
          len: { $size: "$completedTests" },
        },
      },
    ]),
    User.aggregate([
      {
        $addFields: {
          accuracy: {
            $cond: {
              if: { $eq: ["$totalAssignedTests", []] },
              then: 0,
              else: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $size: "$completedTests" },
                          { $size: "$totalAssignedTests" },
                        ],
                      },
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
        as: "filteredTest",
      },
    },
    { $unwind: "$filteredTest" },
    {
      $group: {
        _id: "$_id",
        totalScore: { $sum: "$completedTests.score" },
        scores: { $push: "$completedTests.score" },
        maxPossibleScore: { $sum: { $size: "$filteredTest.questions" } },
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

  // accuracy bounded by 100%
  const stats = {
    assignedTests: assignedTests[0].len,
    finishedTests: finishedTests[0].len,
    accuracy: accuracy[0].accuracy > 100 ? 100 : accuracy[0].accuracy,
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
        as: "filteredTest",
      },
    },
    {
      $unwind: "$filteredTest",
    },
    {
      $sort: {
        "completedTests.completedAt": -1,
      },
    },
    {
      $limit: 100, // limiting to 100 recent test
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
        isPassed: {
          $gte: ["$completedTests.score", "$filteredTest.passingMarks"],
        },
        name: "$filteredTest.name",
        categories: "$filteredTest.categories",
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

  const testData = await Test.findById(id);

  const result = {
    testName: testData.name,
    score: testResult[0].score,
    isPassed: parseInt(testResult[0].score) >= testData.passingMarks,
    completedAt: moment(testResult[0].completedAt).format(
      "Do MMMM YYYY, h:mm a"
    ),
    totalQuestions: testData.questions.length,
    timeTaken: moment
      .utc(
        moment(testResult[0].completedAt).diff(moment(testResult[0].startAt))
      )
      .format("HH:mm:ss"),
  };

  return res.status(200).json({
    success: true,
    result,
  });
});

const updateTestStart = TryCatch(async (req, res, next) => {
  const { testId } = req.params;
  const { startAt } = req.body;

  const user = await User.findById(req.uId);

  const testExist = user.completedTests.some(
    (test) => test.testId.toString() === testId
  );

  if (testExist) {
    await User.updateOne(
      {
        _id: req.uId,
        "completedTests.testId": testId,
      },
      {
        $set: {
          "completedTests.$.startAt": startAt,
        },
      }
    );
  } else {
    await User.findByIdAndUpdate(
      req.uId,
      {
        $push: {
          completedTests: {
            testId,
            startAt,
          },
        },
      },
      { new: true }
    );
  }

  return res
    .status(200)
    .json({ success: true, message: "Test start time Updated" });
});

module.exports = {
  userInfo,
  changePassword,
  completedTests,
  submitTest,
  testDashboardData,
  testDashboardTableData,
  getTestResult,
  updateTestStart,
};
