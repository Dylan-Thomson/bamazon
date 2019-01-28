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
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) as department_sales, (SUM(products.product_sales) - departments.over_head_costs) as total_profit FROM departments INNER JOIN products on departments.department_name = products.department_name GROUP BY departments.department_id", (err, res) => {
        const data = [["Department ID", "Department Name", "Overhead Costs", "Department Sales", "Total Profit"]];
        res.forEach(row => {
            data.push([row.department_id, row.department_name, row.over_head_costs, row.department_sales, "$" + Number(row.total_profit).toFixed(2)]);
        });
        console.log(table(data));
        supervisorMenu();
    });
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
