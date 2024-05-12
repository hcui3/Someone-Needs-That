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
  const { userName, content } = event;
  const itemId = parseInt(event.itemId, 10);
  const userId = parseInt(event.userId, 10);

  // Insert the message into the database
  try {
    const messageData = {
      itemId: itemId,
      userId: userId,
      userName: userName,
      content: content,
    };

    let owner = await pool.query("SELECT userId FROM Item WHERE itemId = ?", itemId)
    if (owner[0].userId == userId){
      messageData.userName = 'Original Owner'
    }

    await pool.query("INSERT INTO Message SET ?", messageData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message inserted successfully" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to insert message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to insert message" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
