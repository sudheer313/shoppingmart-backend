require("dotenv").config();
const stripeAPI = require("stripe")(process.env.STRIPE_SECRET_KEY);

try {
  const customer = stripeAPI.customers.retrieve("cus_NA6pRsDGqrBhmy");
  console.log(customer);
  //const products = JSON.parse(customer.metadata.purchasedItems);
  //save order in Database
  //createOrder(session, products);
  //send order confirmation mail to server
  //sendEmail(session.customer_email, "payment suess for order", products);
} catch (error) {
  console.log(error);
}
