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

exports.lambdaHandler = async () => {
  try {
    const items = await pool.query("SELECT * FROM Item ORDER BY itemId DESC");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Items retrieved successfully",
        results: items,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    };
  } catch (error) {
    console.error("Failed to retrieve items:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve items",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
