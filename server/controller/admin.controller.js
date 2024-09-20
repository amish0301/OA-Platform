const User = require("../db/user.model");
const Test = require("../db/test.model");
const { TryCatch } = require("../utils/helper");

const adminLogin = TryCatch(async (req, res) => {
  const { key } = req.body;

  if (!key)
    return res
      .status(400)
      .json({ success: false, message: "Please enter key" });

  // check key is matching or not
  if (key !== process.env.ADMIN_KEY)
    return res.status(400).json({ success: false, message: "Invalid key" });

  const user = await User.findByIdAndUpdate(
    req.uId,
    { $set: { isAdmin: true } },
    { new: true }
  );

  return res
    .status(200)
    .json({ success: true, message: "Admin login successfully", user });
});

const adminLogout = TryCatch(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.uId,
    { $set: { isAdmin: false } },
    { new: true }
  );

  return res
    .status(200)
    .json({ success: true, message: "Admin logout successfully", user });
});

const fetchUsers = TryCatch(async (req, res) => {
  const users = await User.find({});
  return res
    .status(200)
    .json({ success: true, message: "Fetched All users", users });
});

const dashboardStats = TryCatch(async (req, res) => {
  const [usersCount, testsCount] = await Promise.all([
    User.countDocuments(),
    Test.countDocuments(),
  ]);

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);

  const last7DaysUsers = await User.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  const dayToUserCount = new Array(7).fill(0);
  last7DaysUsers.forEach((user) => {
    // find index of where user lies in last 7 days
    const idx = Math.floor(
      (today.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (idx >= 0 && idx < 7) {
      dayToUserCount[6 - idx]++;
    }
  });

  // testChartData
  const testChartData = {
    finishedTests: 0,
    unfinishedTests: 0,
  };

  // completion % = comp/assigned total
  // notcomp % = notFinished / assigned total

  // Aggregation Pipeline
  const ans = await User.aggregate([
    {
      $project: {
        //  base case - if array is null, return empty array
        completedTests: {
          $cond: {
            if: { $isArray: "$completedTests" },
            then: "$completedTests",
            else: [],
          },
        },
        assignedTests: {
          $cond: {
            if: { $isArray: "$assignedTests" },
            then: "$assignedTests",
            else: [],
          },
        },
      },
    },
    {
      $project: {
        completedTestsCount: { $size: "$completedTests" },
        assignedTestsCount: { $size: "$assignedTests" },
        notFinishedTestsCount: {
          $subtract: ["$assignedTestsCount", "$completedTestsCount"],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalCompletedTests: { $sum: "$completedTestsCount" },
        totalNotFinishedTests: { $sum: "$notFinishedTestsCount" },
        totalAssignedTests: { $sum: "$assignedTestsCount" },
      },
    },
    {
      $project: {
        _id: 0,
        totalCompletedTests: 1,
        totalNotFinishedTests: 1,
        totalAssignedTests: 1,
        finishedTestsRatio: {
          $cond: {
            if: { $eq: ["$totalAssignedTests", 0] },
            then: 0,
            else: {
              $multiply: [
                { $divide: ["$totalCompletedTests", "$totalAssignedTests"] },
                100,
              ],
            },
          },
        },
        notFinishedTestsRatio: {
          $cond: {
            if: { $eq: ["$totalAssignedTests", 0] },
            then: 0,
            else: {
              $multiply: [
                { $divide: ["$totalNotFinishedTests", "$totalAssignedTests"] },
                100,
              ],
            },
          },
        },
      },
    },
  ]);

  if (ans.length) {
    testChartData.finishedTests = ans[0].finishedTestsRatio;
    testChartData.unfinishedTests = ans[0].notFinishedTestsRatio;
  }

  // categoryChartData
  const categoryChartData = await Test.aggregate([
    {
      $unwind: "$categories",
    },
    {
      $group: {
        _id: "$categories",
        testCount: { $sum: 1 },
      },
    },
    // sum of every category tests
    {
      $group: {
        _id: null,
        totalTests: { $sum: "$testCount" },
        categoryData: { $push: { category: "$_id", count: "$testCount" } },
      },
    },
    // calculating percentage for each category
    {
      $unwind: "$categoryData",
    },
    {
      $project: {
        _id: 0,
        categoryName: "$categoryData.category",
        count: "$categoryData.count",
        percentage: {
          // base case - if totalTests is 0, return 0 to avoid /0 error
          $cond: {
            if: { $eq: ["$totalTests", 0] },
            then: 0,
            else: {
              $multiply: [
                { $divide: ["$categoryData.count", "$totalTests"] },
                100,
              ],
            },
          },
        },
      },
    },
  ]);

  const mostPopularTestCategory = await Test.aggregate([
    {
      $unwind: "$categories",
    },
    {
      $group: {
        _id: "$categories",
        testCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        testCount: -1,
      },
    },
    {
      $limit: 1,
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        testCount: 1,
      },
    },
  ]);

  if (mostPopularTestCategory.length) {
    categoryChartData[0].category = mostPopularTestCategory[0].category;
    categoryChartData[0].count = mostPopularTestCategory[0].testCount;
  }

  const stats = {
    usersCount,
    testsCount,
    userChartData: dayToUserCount,
    testChartData,
    categoryChartData,
    mostPopularTestCategoryName: categoryChartData[0].category, 
  };

  return res.status(200).json({ success: true, stats });
});

module.exports = { adminLogin, adminLogout, fetchUsers, dashboardStats };
