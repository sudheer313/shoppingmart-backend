const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const paymentRoutes = require("./routes/checkout");
const stripeWebhookRoutes = require("./routes/stripe-webhooks");

//connect to db
connectDB();
// Init the express app
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cookieParser());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");

//   next();
// });
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/stripe", stripeWebhookRoutes);
app.use(errorHandler);

//start server
app.listen(port, () => {
  console.log("server started on port 5000");
});
