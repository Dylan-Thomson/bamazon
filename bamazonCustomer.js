require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const {table} = require("table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("=========== WELCOME TO BAMAZON ===========");
  displayProducts().then(purchasePrompt);
});

// Display all entries in database with ids, name, and price
function displayProducts() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT products.id, products.product_name, products.price FROM products", (err, res) => {
            if(err) {
                reject(err);
            }
            else {
                // Construct data for table
                const data = [];
                res.forEach(row => {
                    data.push([row.id, row.product_name, "$" + row.price]);
                });
                
                // Display products as a table
                console.log(table(data));

                // Pass length of data to then() callback for validation
                resolve(data.length);
            }
        });
    });
}

// Prompt user to type id of product they wish to buy and quantity
function purchasePrompt(rowCount) {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the ID number for the item you wish to purchase:",
            validate: input => {
                // Make sure input is an integer greater than zero
                if(!isPositiveInteger(input)) {
                    return "Please enter an integer number greater than zero.";
                }
                // Make sure ID exists. Highest ID is equal to the length of the data table (the number of rows)
                else if(Number(input) > rowCount) {
                    return "Item number not found";
                }
                else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "purchaseQuantity",
            message: "Enter the quantity you wish to purchase:",
            validate: input => {
                // Make sure input is an integer greater than zero
                if(!isPositiveInteger(input)) {
                    return "Please enter an integer number greater than zero.";
                }
                else {
                    return true;
                }
            }
        }
    ]).then(input => {
        console.log("Processing order -> Item ID: " + input.itemID + " Quantity: " + input.purchaseQuantity);
        connection.query("SELECT products.stock_quantity, products.price FROM products WHERE ?", {id: input.itemID}, (err, res) => {
            const item = res[0];
            // Check to see if there is enough in stock to fulfill order
            if(input.purchaseQuantity > item.stock_quantity) {
                console.log("Insufficient quantity!!!");
            }
            else {
                // Update quantity of item in stock and display purchase total
                connection.query("UPDATE products SET ? WHERE ?", 
                [
                    {
                        stock_quantity: Number(item.stock_quantity) - Number(input.purchaseQuantity)
                    },
                    {
                        id: input.itemID
                    }
                ], (err, res) => {
                    if(err) console.log(err);
                    const total = Number(input.purchaseQuantity) * Number(item.price);
                    console.log("Total: $" + total.toFixed(2));
                });
            }
        });
    });
}

function isPositiveInteger(input) {
    const number = Number(input);
    return Number.isInteger(number) && String(number) === input && number > 0;
}

