const mongoose = require("mongoose");

// question schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  answer: {
    type: String,
    required: true,
  },
});

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
    categories: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    duration: {
      type: String, // IN MIN 
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
