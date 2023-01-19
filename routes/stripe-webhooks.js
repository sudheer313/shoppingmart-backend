const express = require("express");
const { handleStripeWebhookEvent } = require("../controllers/stripe-webhook");

const router = express.Router();

//http://localhost:5000/api/stripe/webhook
router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  handleStripeWebhookEvent
);

module.exports = router;
