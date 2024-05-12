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
  const itemId = parseInt(event.itemId, 10);

  // Check if the item exists
  try {
    const itemExists = await pool.query(
      "SELECT itemId FROM Item WHERE itemId = ?",
      [itemId]
    );
    if (itemExists.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No matching item found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  } catch (error) {
    console.error("Failed to check item existence:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to check item existence" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  // Proceed to delete item related data
  try {
    await pool.query("DELETE FROM Wishlist WHERE itemId = ?", [itemId]);
    await pool.query("DELETE FROM Transaction WHERE itemId = ?", [itemId]);
    await pool.query("DELETE FROM Message WHERE itemId = ?", [itemId]);
    await pool.query("DELETE FROM Item WHERE itemId = ?", [itemId]);

    return {
      statusCode: 200,
      body: JSON.stringify({ result: "Item removed successfully" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to remove item:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to remove item" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
