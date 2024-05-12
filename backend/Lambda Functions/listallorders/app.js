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
    const transactions = await pool.query(
      "SELECT transactionId, itemId, transactionDate, userId FROM Transaction ORDER BY transactionDate DESC"
    );

    const transactionItems = await Promise.all(
      transactions.map(async (transaction) => {
        const items = await pool.query(
          "SELECT name, price, userId, category, description FROM Item WHERE itemId = ?",
          [transaction.itemId]
        );
        const item = items[0];

        const user = await pool.query(
          "SELECT userEmail FROM User WHERE userId = ?",
          [item.userId]
        );
        const sellerEmail = user[0]?.userEmail || "Email not found";

        return {
          transactionId: transaction.transactionId,
          itemId: transaction.itemId,
          name: item.name,
          price: item.price,
          transactionDate: transaction.transactionDate,
          userId: transaction.userId,
          sellerId: item.userId,
          sellerEmail: sellerEmail,
          category: item.category,
          description: item.description,
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "All transactions retrieved successfully",
        results: transactionItems,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    };
  } catch (error) {
    console.error("Failed to retrieve all transactions:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve all transactions",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
