const ApiError = require("../utils/ApiError");
const joi = require("joi");

const testValidationSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().optional(),
  duration: joi.string().required(),
  categories: joi.array().items(joi.string()).required(),
  questions: joi
    .array()
    .items(
      joi.object({
        id: joi.optional(),
        question: joi.string().required(),
        options: joi.array().items(joi.string().required()).min(2).required(),
        answer: joi.string().required(),
      })
    )
    .required(),
});

const validateTestData = (req, res, next) => {
  try {
    const emptyFields = Array.from(Object.entries(req.body)).filter(
      ([_, value]) => value == ""
    );

    if (emptyFields.length > 0) {
      return next(new ApiError(`Fields are empty: ${emptyFields}`, 400));
    }

    req.body.categories = JSON.parse(req.body.categories);
    req.body.questions = JSON.parse(req.body.questions);

    const { error } = testValidationSchema.validate({
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration,
      categories: req.body.categories,
      questions: req.body.questions,
    });

    if (error) {
      return next(new ApiError(error.details[0].message, 400));
    }

    next();
  } catch (error) {
    return next(new ApiError(error.message || "Error in Validation Test", 400));
  }
};

module.exports = {
  validateTestData,
};
