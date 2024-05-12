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
    const transactions = await pool.query(
      "SELECT transactionId, itemId, transactionDate FROM Transaction WHERE userId = ? ORDER BY transactionDate DESC",
      [userId]
    );

    const transactionItems = await Promise.all(
      transactions.map(async (transaction) => {
        const items = await pool.query(
          "SELECT name, price, image FROM Item WHERE itemId = ?",
          [transaction.itemId]
        );
        const item = items[0];
        return {
          transactionId: transaction.transactionId,
          itemId: transaction.itemId,
          name: item.name,
          price: item.price,
          image: item.image,
          transactionDate: transaction.transactionDate,
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Transactions retrieved successfully",
        results: transactionItems,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to retrieve transactions:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve transactions",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
