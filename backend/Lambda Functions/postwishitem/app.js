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
  const itemId = parseInt(event.itemId, 10);

  try {
    const wishlistData = { userId, itemId };
    const exists = await pool.query(
      "SELECT wishlistId FROM Wishlist WHERE userId = ? AND itemId = ?",
      [userId, itemId]
    );

    if (exists.length > 0) {
      // If it exists, remove it from the wishlist
      await pool.query("DELETE FROM Wishlist WHERE userId = ? AND itemId = ?", [
        userId,
        itemId,
      ]);
    } else {
      // If it does not exist, add it to the wishlist
      await pool.query("INSERT INTO Wishlist SET ?", wishlistData);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Wishlist updated successfully",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to update wishlist:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update wishlist" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
