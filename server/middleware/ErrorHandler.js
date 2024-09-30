const ErrorHandler = (err, req, res, next) => {
    err.message ||= "Unknown Error Occurred, Try reloading the page.";
    err.status ||= 500;
  
    // Duplicate key error
    if (err.code === 11000) {
      const error = Object.keys(err.keyPattern).join(",");
      err.message = `Duplicate Field - ${error}`;
      err.status = 400;
    }
  
    // Cast error
    if (err.name === "CastError") {
      const path = err.path;
      err.message = `Invalid Format of ${path}`;
      err.status = 400;
    }
  
    const envMode = process.env.NODE_ENV;
  
    const response = {
      success: false,
      message: err.message,
    };
  
    if(envMode === "development") {
      response.error = err;
    }
  
    return res.status(err.status).json(response);
  };
  
  module.exports = { ErrorHandler };