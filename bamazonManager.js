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
    connection.query("SELECT * FROM PRODUCTS", (err, res) => {
        if(err) throw err;
        console.log(buildDisplayTable(res));
        managerMenu();
    });
}

function viewLowInventory() {
    console.log("Viewing Low Inventory");
    connection.query("SELECT * FROM PRODUCTS WHERE products.stock_quantity <= 5", (err, res) => {
        if(err) console.log(err);
        console.log(buildDisplayTable(res));
        managerMenu();
    });
}

function addInventory() {
    console.log("Adding Inventory");
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

connection.connect(err => {
    if (err) throw err;
    // console.log("=========== WELCOME TO BAMAZON ===========");
    managerMenu();
});
