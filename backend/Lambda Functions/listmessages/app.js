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

  try {
    const messages = await pool.query(
      "SELECT content, userName, messageDate FROM Message WHERE itemId = ? ORDER BY messageDate DESC",
      [itemId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Messages retrieved successfully",
        results: messages,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve messages",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
