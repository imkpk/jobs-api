// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

//duplication errors

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statCode: err.statCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something went wrong try again later`,
  };
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statCode).json({ msg: err.message });
  // }
  //duplicate Error email
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    console.log(customError.msg);
    customError.statCode = 400;
  }
  //validation error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err["keyValue"]
    )} field,please choose another value`;
    customError.statCode = 400;
  }

  //cast errorĀĀ
  if (err.code === "CastError") {
    customError.msg = `please proved proper job id: ${err.value}`;
    customError.statCode = StatusCodes.NOT_FOUND;
  }
  // return res.status(statCode.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statCode).json({ msg: customError.msg });
  // next()
};

module.exports = errorHandlerMiddleware;
