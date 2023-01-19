const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { username, email, passwordstr } = req.body;
  if (!username || !email || !passwordstr) {
    res.status(400);
    return next(new Error("username , email and password req"));
  }
  try {
    // check if already exist
    //find user from user collection where email is ....
    const exists = await User.findOne({ email: email });

    if (exists) {
      res.status(400);
      return next(new Error("user already exists in data base"));
    }
    //hash password
    const hashedPassword = await bcryptjs.hash(passwordstr, 10);

    //create user in DB
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //oject destrcturing
    //const { password, ...others } = user._doc;
    console.log(user);
    return res.status(201).json({
      suceess: true,
      // user: others,
      message: "registration sucessfull",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

//login user
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    return next(new Error("email & passwords fields are required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      return next(new Error("user doesnot exists"));
    }
    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      res.status(400);
      return next(
        new Error("Invalid credentials, please try with correct password")
      );
    }
    const token = generateToken(user._id);
    res.cookie("access_token", token).status(200).json({
      suceess: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

//google auth

const handleGoogleAuth = async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({
      suceess: false,
      message: "username, email & password fields are required",
    });
  }
  try {
    //check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      const token = generateToken(exists._id);
      res.cookie("access_token", token).status(200).json({
        suceess: true,
        user: exists,
      });
    } else {
      const user = await User.create({
        username,
        email,
        fromGoogle: true,
      });
      const token = generateToken(user._id);
      res.cookie("access_token", token).status(200).json({
        suceess: true,
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  handleGoogleAuth,
};
