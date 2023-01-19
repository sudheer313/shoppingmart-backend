const express = require("express");
const { createCheckoutSession } = require("../controllers/checkout");

const router = express.Router();
//http://localhost:5000/api/payment/create-checkout-session
router.post("/create-checkout-session", createCheckoutSession);
module.exports = router;
