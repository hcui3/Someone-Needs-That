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
  const { name, description, category, image } = event;
  const userId = parseInt(event.userId, 10);
  const price = parseFloat(event.price);

  // Insert the item into the database
  try {
    const itemData = {
      name: name,
      description: description,
      category: category,
      price: price,
      userId: userId,
      image: image,
      itemDate: new Date().toISOString(),
    };

    await pool.query("INSERT INTO Item SET ?", itemData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Item inserted successfully" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  } catch (error) {
    console.error("Failed to insert item:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to insert item." }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
