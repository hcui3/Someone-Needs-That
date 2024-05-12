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
  const { newUsername, username } = event;
  const userId = parseInt(event.userId, 10);

  // First check if the user exists.
  try {
    const user = await pool.query("SELECT userId FROM User WHERE userId = ?", [
      userId,
    ]);

    if (user.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No matching user found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    } else {
      // Then check to see if the new username already exists.
      try {
        const usernameResults = await pool.query(
          "SELECT userId FROM User WHERE userName = ?",
          [newUsername]
        );

        if (usernameResults.length > 0) {
          return {
            statusCode: 409,
            body: JSON.stringify({ error: "Username already exists" }),
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          };
        } else {
          // Update the username in the User and Message tables of the DB.
          try {
            await pool.query("UPDATE User SET userName = ? WHERE userId = ?", [
              newUsername,
              userId,
            ]);

            await pool.query("UPDATE Message SET userName = ? WHERE userName = ?", [
              newUsername,
              username,
            ]);

            return {
              statusCode: 200,
              body: JSON.stringify({ message: "Username successfully updated" }),
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
              },
            };
          } catch (error) {
            console.error("Failed to update username:", error);
            return {
              statusCode: 500,
              body: JSON.stringify({ error: "Failed to update username" }),
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            };
          }
        }
      } catch (error) {
        console.error("Failed to check new username existence:", error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Failed to check new username existence" }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        };
      }
    }
  } catch (error) {
    console.error("Failed to check user existence:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to check user existence" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};

