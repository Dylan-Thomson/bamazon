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

class Command {
    constructor(run) {
        this.run = run;
    }
}

const commands = {
    "View Products for Sale": new Command(viewProducts),
    "View Low Inventory": new Command(viewLowInventory),
    "Add to Inventory": new Command(addInventory),
    "Add New Product": new Command(addNewProduct),
    "Exit": new Command(exit)
}

function managerMenu() {
    console.log("=========== BAMAZON MANAGER ===========");
    inquirer.prompt([
        {
            type: "list",
            name: "managerFunction",
            message: "Manager Functions:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(input => {
        commands[input.managerFunction].run();
    });
}

function viewProducts() {
    console.log("Viewing Products");
    connection.query("SELECT * FROM products", (err, res) => {
        if(err) console.log(err);
        console.log(buildDisplayTable(res));
        managerMenu();
    });
}

function viewLowInventory() {
    console.log("Viewing Low Inventory");
    connection.query("SELECT * FROM products WHERE products.stock_quantity <= 5", (err, res) => {
        if(err) console.log(err);
        console.log(buildDisplayTable(res));
        managerMenu();
    });
}

function addInventory() {
    console.log("Adding Inventory");
    connection.query("SELECT COUNT(*) FROM products", (err, res) => {
        const maxID = res[0]["COUNT(*)"]
        inquirer.prompt([
            {
                type: "input",
                name: "itemID",
                message: "Enter the ID number for the item you wish to restock",
                validate: input => {
                    // Make sure input is an integer greater than zero
                    if(!isPositiveInteger(input)) {
                        return "Please enter an integer number greater than zero.";
                    }
                    // Make sure ID exists. Highest ID is equal to the length of the data table (the number of rows)
                    else if(Number(input) > maxID) {
                        return "Item number not found.";
                    }
                    return true;
                }
            },
            {
                type: "input",
                name: "restockQuantity",
                message: "Enter the quantity to restock",
                validate: input => {
                    // Make sure input is an integer greater than zero
                    if(!isPositiveInteger(input)) {
                        return "Please enter an integer number greater than zero.";
                    }
                    return true;
                }
            }
        ]).then(input => {
            connection.query("UPDATE products SET products.stock_quantity = products.stock_quantity + " + Number(input.restockQuantity) + " WHERE ?", 
            {id: Number(input.itemID)}, 
            (err, res) => {
                if(err) console.log(err);
                console.log(input.restockQuantity + " added to stock for " + input.itemID);
                managerMenu();
            });
        });
    });
}

function addNewProduct() {
    console.log("Adding New Product");
}

function exit() {
    connection.end();
}

function buildDisplayTable(data) {
    const dataTable = [["Item ID", "Product Name", "Department", "Sale Price", "Stock Quantity"]];
    data.forEach(row => {
        dataTable.push([row.id, row.product_name, row.department_name, "$" + row.price, row.stock_quantity])
    });
    return table(dataTable);
}

// Validates whether input is a positive integer TODO MOVE
function isPositiveInteger(input) {
    const number = Number(input);
    return Number.isInteger(number) && String(number) === input && number > 0;
}

connection.connect(err => {
    if (err) throw err;
    managerMenu();
});
