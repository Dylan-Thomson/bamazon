const connection = require("./modules/connection");
const validate = require("./modules/validate");
const inquirer = require("inquirer");
const tableBuilder = require("./modules/tableBuilder");
const Command = require("./modules/Command");

// Define commands for supervisor menu
const commands = {
    "View Product Sales by Department": new Command(viewProductSales),
    "Create New Department": new Command(createNewDepartment),
    "Exit": new Command(exit)
}

// Prompt supervisor to run a function
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

// Display department overhead, total sales, and profit
function viewProductSales() {
    console.log("=========== Viewing product sales by department ===========");
    let query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs,";
    query += " SUM(products.product_sales) as department_sales, (SUM(products.product_sales) - departments.over_head_costs) as total_profit"
    query += " FROM departments LEFT JOIN products on departments.department_name = products.department_name";
    query += " GROUP BY departments.department_id";
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log(tableBuilder.buildProductSalesTable(res));
        supervisorMenu();
    });
}

function createNewDepartment() {
    console.log("=========== Creating new department ===========");
    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "Enter department name",
            validate: validate.validateString
        },
        {
            type: "input",
            name: "over_head_costs",
            message: "Enter overhead costs",
            validate: validate.validatePrice
        }
    ]).then(input => {
        connection.query("INSERT INTO departments SET ?",
        {
            department_name: input.department_name,
            over_head_costs: Number(input.over_head_costs)
        }, (err, res) => {
            if(err) throw err;
            console.log(res);
            console.log("Added " + input.department_name + " department with overhead costs of " + input.over_head_costs);
            supervisorMenu();
        });
    });
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
