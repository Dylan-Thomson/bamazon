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
    constructor(run){
        this.run = run;
    }
}

const commands = {
    "View Products for Sale": new Command(viewProducts),
    "View Low Inventory": new Command(viewLowInventory),
    "Add to Inventory": new Command(addInventory),
    "Add New Product": new Command(addNewProduct)
}

function managerMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "managerFunction",
            message: "Manager Functions:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(input => {
        commands[input.managerFunction].run();
    });
}

function viewProducts() {
    console.log("Viewing Products");
}

function viewLowInventory() {
    console.log("Viewing Low Inventory");
}

function addInventory() {
    console.log("Adding Inventory");
}

function addNewProduct() {
    console.log("Adding New Product");
}

connection.connect(err => {
    if (err) throw err;
    // console.log("=========== WELCOME TO BAMAZON ===========");
    // displayProducts().then(purchasePrompt);
    managerMenu();
});
