const stripeAPI = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { items, customer_email } = req.body;
  const client_url = "http://localhost:3000";

  if (!items || !customer_email) {
    return res.status(400).json({
      error: "Missing required params to create checkout session",
    });
  }

  try {
    const customer = await stripeAPI.customers.create({
      email: customer_email,
      metadata: {
        purchasedItems: JSON.stringify(
          items.map((item) => {
            return {
              description: item.description.slice(0, 10),
              ...item,
            };
          })
        ),
      },
    });

    const session = await stripeAPI.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "KE", "AU"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items: items.map((productItem) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: productItem.name,
              description: productItem.description,
              images: [productItem.image], //to store more than one value of same data type
            },
            unit_amount: productItem.price * 100,
          },
          quantity: productItem.quantity,
        };
      }),
      success_url: `${client_url}/success?session_id={CHECTOUT_SESSION_ID}`,
      cancel_url: `${client_url}/cancel`,
    }); // session logic

    res.status(200).json({
      sessionId: session.id,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createCheckoutSession,
};
