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
        startAt: {
          type: Date,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalAssignedTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
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
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "30m",
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  const newRefreshToken = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
  this.refreshToken = newRefreshToken;
  await this.save({ validateBeforeSave: false });
  return newRefreshToken;
};

userSchema.methods.verifyRefreshToken = function (token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = mongoose.model("User", userSchema);
