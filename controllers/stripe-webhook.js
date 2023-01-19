require("dotenv").config();
const stripeAPI = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const sendEmail = require("../utils/sendGridEmail");
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const createOrder = async (eventData, products) => {
  try {
    const savedOrder = await Order.create({
      purchased_items: products,
      shipping_details: eventData.shipping_details,
      subtotal: eventData.amount_subtotal,
      total: eventData.amount_total,
      payment_status: eventData.payment_status,
    });
    console.log(savedOrder);
  } catch (error) {
    console.log(error);
  }
};

const handleStripeWebhookEvent = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
  const sig = req.headers["stripe-signature"];
  const payload = req.body;
  const payloadString = JSON.stringify(payload, null, 2);
  const header = await stripeAPI.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: endpointSecret,
  });
  let event;

  try {
    event = await stripeAPI.webhooks.constructEvent(
      payloadString,
      header,
      endpointSecret
    );
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  let session;
  // console.log(typeof req.body);
  // console.log(req.body.data.object);
  //Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      session = event.data.object;
      console.log(session);

      try {
        const customer = await stripeAPI.customers.retrieve(session.customer);
        console.log(customer);
        const products = JSON.parse(customer.metadata.purchasedItems);
        console.log(products);
        //save order in Database
        createOrder(session, products);
        //send order confirmation mail to server
        sendEmail(customer.email, "payment suess for order", products);
      } catch (error) {
        console.log(error);
      }

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event

  res.status(200).end();
};

module.exports = {
  handleStripeWebhookEvent,
};
