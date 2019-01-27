require("dotenv").config();
const mysql = require("mysql");

// Set up connection to DB
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "bamazon"
});

module.exports = connection;