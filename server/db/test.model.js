const mongoose = require("mongoose");

// question schema
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOption: {
    type: Number,
    required: true,
  },
});

const testSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
    category: {
      type: String,
      required: true,
    },
    subCategory: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
    },
    duration: {
      type: String, // Form of "HH:MM:SS"
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
