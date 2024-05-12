const config = require("./config.json");

const stripe = require("stripe")(config.stripe_key);
const mysql = require("mysql");
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

const util = require("util");
pool.query = util.promisify(pool.query);

exports.lambdaHandler = async (event) => {
  const { name, price, image, successUrl, cancelUrl } = event;
  const itemId = parseInt(event.itemId, 10);

  // Check if the item exists and is not sold
  try {
    const itemStatus = await pool.query(
      "SELECT sold FROM Item WHERE itemId = ?",
      [itemId]
    );

    if (itemStatus.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    } else if (itemStatus[0].sold) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "Item is already sold" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  } catch (error) {
    console.error("Failed to check item status:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to check item status" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  // Create Stripe checkout session if item is not sold
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name,
              images: [image],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Failed to create Stripe checkout session:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create Stripe checkout session",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
