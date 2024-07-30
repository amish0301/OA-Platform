const User = require("../db/user.model");
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

  // if key is matching then make isAdmin true in db

  // if (req.gId) {
  //   const user = await User.findOneAndUpdate(
  //     { googleId: req.gId },
  //     { isAdmin: true },
  //     { new: true }
  //   );

  //   return res
  //     .status(200)
  //     .json({ success: true, message: "Admin login successfully", user });
  // }

  const user = await User.findByIdAndUpdate(
    req.uId,
    { isAdmin: true },
    { new: true }
  );

  return res
    .status(200)
    .json({ success: true, message: "Admin login successfully", user });
});

module.exports = { adminLogin };
