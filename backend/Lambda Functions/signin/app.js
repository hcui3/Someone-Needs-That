const config = require("./config.json");

const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

const jwt = require("jsonwebtoken");
const secretKey = "secret_ecom";

const util = require("util");
pool.query = util.promisify(pool.query);

exports.lambdaHandler = async (event) => {
  const email = event.email;
  const password = event.password;

  // Attempt to sign in the user
  try {
    const user = await pool.query(
      "SELECT userId, userPassword, userName FROM User WHERE userEmail = ?",
      [email]
    );

    if (user.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "No matching user found",
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    // Compare the password with the stored hash
    const match = await bcrypt.compare(password, user[0].userPassword);

    if (!match) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Email or password is incorrect",
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    // Generate token
    const tokenData = {
      user: {
        id: user[0].userId,
      },
    };
    const token = jwt.sign(tokenData, secretKey);

    return {
      statusCode: 200,
      body: JSON.stringify({
        token: token,
        userName: user[0].userName,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to sign in user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to sign in user",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
