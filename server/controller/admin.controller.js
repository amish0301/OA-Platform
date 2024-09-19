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

  // aggregation pipeline

  // update schema to 

  // completion % = comp/assigned total
  // notcomp % = assigned - comp / assigned total

  

  const stats = {
    usersCount,
    testsCount,
    userChartData: dayToUserCount,
  };

  return res.status(200).json({ success: true, stats });
});

module.exports = { adminLogin, adminLogout, fetchUsers, dashboardStats };
