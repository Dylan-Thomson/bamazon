require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const {table} = require("table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.DB_PASSWORD,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayProducts().then(purchasePrompt);
});

// Display all entries in database with ids, name, and price
function displayProducts() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT products.id, products.product_name, products.price, products.stock_quantity FROM products", (err, res) => {
            if(err) {
                reject(console.log(err));
            }
            else {
                // Construct data for table
                const data = [];
                res.forEach(row => {
                    data.push([row.id, row.product_name, "$" + row.price]);
                });
                
                // Display products as a table
                console.log(table(data));

                // Pass data to then() callback function
                resolve(res);
            }
        });
    });
}

// Prompt user to type id of product they wish to buy and quantity
function purchasePrompt(res) {
    console.log(res);
    const itemIDs = [];
    res.forEach(row => {
        itemIDs.push(row.id);
    });
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the ID number for the item you wish to purchase:",
            validate: input => {
                if(!isPositiveNumber(input)) {
                    return "Please enter a number greater than zero.";
                }
                else if(!itemIDs.includes(Number(input))) {
                    return "Item not found.";
                }
                else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "purchaseQuantity",
            message: "Enter the quanity you wish to purchase:",
            validate: input => {
                if(!isPositiveNumber(input)) {
                    return "Please enter a number greater than zero.";
                }
                else {
                    return true;
                }
            }
        }
    ]).then(input => {
        console.log(input.itemID, input.purchaseQuantity);
    });
}
// Check to see if there is enough in stock to fulfill order
//  If not, cancel order and tell user there isn't enough in stock
// Update quantity of item in stock and display purchase total

function isPositiveNumber(input) {
    const number = Number(input);
    return number !== Infinity && String(number) === input && number > 0;
}

