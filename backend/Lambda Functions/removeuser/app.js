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

  // Check if the user exists
  try {
    const userExists = await pool.query(
      "SELECT userId FROM User WHERE userId = ?",
      [userId]
    );
    if (userExists.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No matching user found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  } catch (error) {
    console.error("Failed to check user existence:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to check user existence" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  // Proceed to delete user related data
  try {
    await pool.query("DELETE FROM Item WHERE userId = ?", [userId]);
    await pool.query("DELETE FROM Message WHERE userId = ?", [userId]);
    await pool.query("DELETE FROM Transaction WHERE userId = ?", [userId]);
    await pool.query("DELETE FROM Wishlist WHERE userId = ?", [userId]);
    await pool.query("DELETE FROM User WHERE userId = ?", [userId]);

    return {
      statusCode: 200,
      body: JSON.stringify({ result: "User removed successfully" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to remove user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to remove user" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
