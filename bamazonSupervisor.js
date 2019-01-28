const connection = require("./modules/connection");
const validate = require("./modules/validate");
const inquirer = require("inquirer");
const {table} = require("table");
const Command = require("./modules/Command");

// Define commands for supervisor menu
const commands = {
    "View Product Sales by Department": new Command(viewProductSales),
    "Create New Department": new Command(createNewDepartment),
    "Exit": new Command(exit)
}

function supervisorMenu() {
    console.log("=========== BAMAZON SUPERVISOR ===========");
    inquirer.prompt([
        {
            type: "list",
            name: "supervisorFunction",
            message: "Supervisor Functions:",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(input => {
        commands[input.supervisorFunction].run();
    });
}

function viewProductSales() {
    console.log("Viewing product sales by department");
}

function createNewDepartment() {
    console.log("Creating new department");
}

// End connection and exit program
function exit() {
    connection.end();
}

// Connect to DB and run
connection.connect(err => {
    if (err) throw err;
    supervisorMenu();
});
