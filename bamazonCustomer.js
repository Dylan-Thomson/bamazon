const connection = require("./modules/connection");
const validate = require("./modules/validate");
const inquirer = require("inquirer");
const tableBuilder = require("./modules/tableBuilder");

// Display all entries in database with ids, name, and price
function displayProducts() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT products.id, products.product_name, products.price FROM products", (err, res) => {
            if(err) {
                reject(err);
            }
            else {
                console.log(tableBuilder.buildCustomerProductTable(res));            
                resolve();
            }
        });
    });
}

// Prompt user to type id of product they wish to buy and quantity
function purchasePrompt() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the ID number for the item you wish to purchase:",
            validate: validate.validateID
        },
        {
            type: "input",
            name: "purchaseQuantity",
            message: "Enter the quantity you wish to purchase:",
            validate: validate.validateQuantity
        }
    ]).then(input => {
        console.log("Processing order -> Item ID: " + input.itemID + " Quantity: " + input.purchaseQuantity);
        attemptTransaction(input);
    });
}

// Select product by ID and purchase if there is enough in stock
function attemptTransaction(input) {
    connection.query("SELECT products.product_name, products.stock_quantity, products.price, products.product_sales FROM products WHERE ?", {id: input.itemID}, (err, res) => {
        if(err) console.log(err);
        const item = res[0];
        if(input.purchaseQuantity > item.stock_quantity) {
            console.log("Insufficient quantity!!!");
            purchasePrompt();
        }
        else {
            purchase(input, item);
        }
    });
}

// Update quantity of item in stock and display purchase total
function purchase(input, item) {
    connection.query("UPDATE products SET ?, ? WHERE ?", 
    [
        {
            stock_quantity: Number(item.stock_quantity) - Number(input.purchaseQuantity)
        },
        {
            product_sales: Number(item.product_sales) + Number(item.price) * Number(input.purchaseQuantity)
        },
        {
            id: input.itemID
        }
    ], (err, res) => {
        if(err) console.log(err);
        const total = Number(input.purchaseQuantity) * Number(item.price);
        console.log("You purchased " + input.purchaseQuantity + " " + item.product_name + "\nTotal: $" + total.toFixed(2));
        connection.end();
    });
    
}

// Connect to DB and run
connection.connect(err => {
    if (err) throw err;
    console.log("=========== WELCOME TO BAMAZON ===========");
    displayProducts().then(purchasePrompt);
});
