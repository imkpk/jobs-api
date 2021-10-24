require("dotenv").config();
const User = require("../models/User");
const { StatusCodes: stc } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// const {BadRequestError} = require("../errors");
// const bcrypt=require(`bcryptjs`)
// const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  // const {name, email, password} = req.body;
  // if (!name || !email || !password) {
  //   throw new BadRequestError(`please provide all fields properly`)
  // }
  // //hashing the password
  // const salt=await bcrypt.genSalt(10);
  // const hashPassword=await bcrypt.hash(password,salt)
  //
  // //bcrypt tem user-object
  // const tempUser={name,email,password:hashPassword};

  // const user = await User.create({...req.body})
  // // const {_id, name} = user
  // const token = createJwt()
  // console.log(token)
  // res.status(stc.CREATED).json({user: {name: user.name}, token})
  // const bdy = await req.body;
  const user = await User.create({ ...req.body });
  const token = user.createJwt();
  // console.log(token);
  res.status(stc.CREATED).json({
    user: { name: user.name },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(`please provide email and password`);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError(`invalid credentials`);
  }
  //compare the password;
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(`invalid credentials`);
  }
  //compare password
  const token = user.createJwt();
  res.status(stc.OK).json({
    user: { name: user.name },
    token,
  });
};

module.exports = {
  register,
  login,
};
