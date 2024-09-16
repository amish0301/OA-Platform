const ErrorHandler = (err, req, res, next) => {
    err.message ||= "Unknown Error Occurred, Try reloading the page.";
    err.statusCode ||= 500;
  
    // Duplicate key error
    if (err.code === 11000) {
      const error = Object.keys(err.keyPattern).join(",");
      err.message = `Duplicate Field - ${error}`;
      err.statusCode = 400;
    }
  
    // Cast error
    if (err.name === "CastError") {
      const path = err.path;
      err.message = `Invalid Format of ${path}`;
      err.statusCode = 400;
    }
  
    const envMode = process.env.NODE_ENV;
  
    const response = {
      success: false,
      message: err.message,
    };
  
    if(envMode === "DEVELOPMENT") {
      response.error = err;
    }
  
    return res.status(err.statusCode).json(response);
  };
  
  module.exports = { ErrorHandler };