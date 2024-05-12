const config = require("./config.json");

const bcrypt = require("bcryptjs");
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
  const { newPassword, currentPassword } = event;
  const userId = parseInt(event.userId, 10);

  // Check if the user exists and the current password is correct
  try {
    const user = await pool.query(
      "SELECT userPassword FROM User WHERE userId = ?",
      [userId]
    );
    if (user.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No matching user found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user[0].userPassword
    );
    if (!passwordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Current password is incorrect" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  } catch (error) {
    console.error(
      "Failed to check user existence and password correctness:",
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to check user existence and password correctness",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  // Update the password
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await pool.query("UPDATE User SET userPassword = ? WHERE userId = ?", [
      hashedPassword,
      userId,
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password successfully updated" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to update password:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update password" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
