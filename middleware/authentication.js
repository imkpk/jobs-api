const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

/**
 * @param {Request<P, ResBody, ReqBody, ReqQuery, Locals>|http.ServerRequest} req
 * @param {Response<ResBody, Locals>|http.ServerResponse} res
 * @param {NextFunction} next
 */
const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT);
    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Error");
  }
};

module.exports = auth;
