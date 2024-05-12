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
  const { email, password } = event;
  let username = event.username;

  // Check if the email already exists
  try {
    const userEmailResults = await pool.query(
      "SELECT userEmail FROM User WHERE userEmail = ?",
      [email]
    );
    if (userEmailResults.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "email already exists" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  } catch (error) {
    console.error("Failed to check email existence:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to check email existence" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  // Check for username uniqueness
  try {
    let uniqueUsernameFound = false;
    let suffix = 0;

    while (!uniqueUsernameFound) {
      const usernameResults = await pool.query(
        "SELECT COUNT(*) AS count FROM User WHERE userName = ?",
        [username]
      );
      if (usernameResults[0].count > 0) {
        suffix++;
        username = `${username}${suffix}`;
      } else {
        uniqueUsernameFound = true;
      }
    }
  } catch (error) {
    console.error("Failed to check username uniqueness:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to check username uniqueness",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  // Create the user
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      userName: username,
      userEmail: email,
      userPassword: hashedPassword,
    };

    await pool.query("INSERT INTO User SET ?", newUser);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User registered successfully",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to register user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to register user",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
