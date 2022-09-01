const { compile } = require("morgan");
const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value :${value}.Please use another value`;
  return new AppError(message, 400);
};

const handleJWTExpiredError = (err) => {
  return new AppError("Your token has expired!Please login again", 401);
};

const handleJWTError = (err) =>
  new AppError("invalid token ,Please login again ", 404);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

//Development error
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    //A) API
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      stack: err.stack,
      message: err.message,
    });
  }
  // B)RENDERED WEBSITE
  console.log("ERROR", err);

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //A)API
  if (req.originalUrl.startsWith("/api")) {
    //A)Production error: Operation,trusted error : send message to client

    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,

        message: err.message,
      });
      //B)Programming or other error : dont leak error details
    }
    //1.log error
    console.log("ERROR", err);
    //2.Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }

  //B) RENDERED WEBSITE
  //A)Production error: Operation,trusted error : send message to client

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  //B)Programming or other error : dont leak error details

  //1.log error
  console.log("ERROR", err);
  //2.Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    // console.log(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError")
      error = handleJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
};
