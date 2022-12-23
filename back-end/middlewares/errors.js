const ErrorHandler = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
  // console.log(err)
  err.statusCode = err.statusCode || 500;
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    console.log("hi");
    res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    let error = { ...err };
    error.message = err.message;
    // Handling wrong id
    if (err.name === "CastError") {
      const message = `Resource not found. invalid : ${err.path}`;
      error = new ErrorHandler(message, 404);
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message , 400)
    }
    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Sertver Error",
    });
  }
};