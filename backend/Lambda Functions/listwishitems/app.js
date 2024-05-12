const config = require("./config.json");

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
  const userId = parseInt(event.userId, 10);

  try {
    const updatedWishlist = await pool.query(
      "SELECT itemId FROM Wishlist WHERE userId = ?",
      [userId]
    );

    const itemList = updatedWishlist.map((item) => item.itemId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Wishlist retrieved successfully",
        wishitems: itemList,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to retrieve wishlist:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve wishlist" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
