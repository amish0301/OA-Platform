const mongoose = require("mongoose");
const Test = require("../db/test.model");
const { TryCatch } = require("../utils/helper");

const createTest = TryCatch(async (req, res) => {
  const { title, questions, duration, description, category, subCategory } =
    req.body;
  const { testId } = req.params;

  // convert id to object id

  // optional - validate if any of the field is not present
  if (!title || !questions || !category || !subCategory || !duration) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields" });
  }

  const test = await Test.create({
    testId,
    title,
    questions,
    category,
    subCategory,
    duration,
    description,
  });

  await test.save();

  return res
    .status(200)
    .json({ success: true, message: "Test created successfully", test });
});

module.exports = { createTest };
