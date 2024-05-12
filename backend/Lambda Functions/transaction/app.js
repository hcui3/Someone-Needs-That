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
  const userId = parseInt(event.userId, 10);

  // Update the item to be sold
  try {
    await pool.query("UPDATE Item SET sold = 1 WHERE itemId = ?", [itemId]);
  } catch (error) {
    console.error("Failed to update item:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update item" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  // Create a new transaction
  try {
    const transactionData = {
      itemId: itemId,
      userId: userId,
      transactionDate: new Date().toISOString(),
    };

    await pool.query("INSERT INTO Transaction SET ?", transactionData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Transaction successful" }),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create transaction" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
