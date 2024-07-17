const User = require("../db/user.model");
const { TryCatch } = require("../utils/helper");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/helper");

const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  // hash passowrd
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User creation failed",
    });
  }

  generateToken(res, user, 201, "User created successfully");
});

module.exports = { registerUser };
