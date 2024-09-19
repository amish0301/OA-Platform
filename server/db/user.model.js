const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    profileImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    completedTests: [
      {
        testId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Test",
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "30m", // 6 min
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );

  this.refreshToken = refreshToken;
  this.refreshTokenExpiry =
    Date.now() + (process.env.REFRESH_TOKEN_EXPIRY || 7 * 24 * 60 * 60 * 1000); // 7 days
  await this.save({ validateBeforeSave: false });

  return refreshToken;
};

userSchema.methods.verifyRefreshToken = function (token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = mongoose.model("User", userSchema);
