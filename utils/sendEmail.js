const nodemailer = require("nodemailer");
require("dotenv").config();
const sendEmail = (to, subject, text) => {
  // return new Promise((resolve, reject) => {
  // const transporter = nodemailer.createTransport({
  // service: "gmail",
  // auth: {
  // user: process.env.GMAIL_USERNAME,
  // pass: process.env.GMAIL_PASSWORD,
  // },
  // });

  // const mailOptions = {
  // from: process.env.EMAIL_FROM,
  // to,
  // subject,
  // text,
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  // if (error) {
  // console.log(error);
  // return reject("Error happened during mail delivery");
  // }
  // console.log(info);
  // return resolve("Email sent successfully!");
  // });
  // });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.com",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  };

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  // transporter.sendMail(mailOptions, (error, info) => {
  // if (error) {
  // console.log(error);
  // // return reject("Error happened during mail delivery");
  // }
  // console.log(info);
  // // return resolve("Email sent successfully!");
  // });
};

sendEmail("kalyansaxena123@gmail.com", "EMAIL TEST", "SENDING IS EASY!");
// module.exports = sendEmail;
