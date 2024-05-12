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
    const users = await pool.query(
      "SELECT userId, userEmail, userName FROM User WHERE userId <> 93 ORDER BY userId DESC"
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Users retrieved successfully",
        results: users,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    };
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve users",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
