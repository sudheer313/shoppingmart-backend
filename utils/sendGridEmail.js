const sgMail = require("@sendgrid/mail");
const Mailgen = require("mailgen");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, subject, products) => {
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  let productsData = products.map((product) => {
    return {
      item: product.name,
      description: product.description,
      price: `$${product.price}`,
    };
  });

  let response = {
    body: {
      name: "Shopping mart",
      intro: subject,
      table: {
        data: productsData,
      },
      outro: "Looking forward to do more business",
    },
  };

  let mail = MailGenerator.generate(response);
  const msg = {
    to,
    from: "kandulasudheerreddy123@gmail.com", // Use the email address or domain you verified above
    subject,
    html: mail,
  };

  //ES6
  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {
      //console.log(error);
      console.log(error.response.body.errors);
    });
};
// sendEmail("kandulasudheerreddy123@gmail.com", "testmail", [
//   {
//     item: "shoes",
//     description: "bata shoes",
//     price: "$10",
//   },
// ]);
module.exports = sendEmail;
