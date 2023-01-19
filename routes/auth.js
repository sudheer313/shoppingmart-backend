const express = require("express");
const { createUser, loginUser,handleGoogleAuth } = require("../controllers/auth");

const router = express.Router();

//create user (/api/auth/signup)
router.post("/signup", createUser);

//signin user
///api/auth/loginUser
router.post("/signin", loginUser);

//Google auth
///api/auth/google
router.post("/google", handleGoogleAuth);

module.exports = router;
