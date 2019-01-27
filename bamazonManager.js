const connection = require("./modules/connection");
const validate = require("./modules/validate");
const inquirer = require("inquirer");
const {table} = require("table");
const Command = require("./modules/Command");

// Define commands for manager menu
const commands = {
    "View Products for Sale": new Command(viewProducts),
    "View Low Inventory": new Command(viewLowInventory),
    "Add to Inventory": new Command(addInventory),
    "Add New Product": new Command(addNewProduct),
    "Exit": new Command(exit)
}

// Prompt user to select a manager function
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

// Display all products
function viewProducts() {
    console.log("Viewing Products");
    connection.query("SELECT * FROM products", (err, res) => {
        if(err) console.log(err);
        console.log(buildDisplayTable(res));
        managerMenu();
    });
}

// Display products with less than 5 in stock
function viewLowInventory() {
    console.log("Viewing Low Inventory");
    connection.query("SELECT * FROM products WHERE products.stock_quantity < 5", (err, res) => {
        if(err) console.log(err);
        console.log(buildDisplayTable(res));
        managerMenu();
    });
}

// Add stock to selected item
function addInventory() {
    console.log("Adding Inventory");
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the ID number for the item you wish to restock",
            validate: validate.validateID
        },
        {
            type: "input",
            name: "restockQuantity",
            message: "Enter the quantity to restock",
            validate: validate.validateQuantity
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
}

// Insert new product into table
function addNewProduct() {
    console.log("Adding New Product");
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Enter product name"
        },
        {
            type: "input",
            name: "department_name",
            message: "Enter department"
        },
        {
            type: "input",
            name: "price",
            message: "Enter price",
            validate: validate.validatePrice
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "Enter stock quantity",
            validate: validate.validateQuantity
        }
    ]).then(input => {
        connection.query("INSERT INTO products SET ?",
        {
            product_name: input.product_name,
            price: input.price,
            department_name: input.department_name,
            stock_quantity: input.stock_quantity
        }, (err, res) => {
            if(err) console.log(err)
            console.log("Added " + input.product_name);
            managerMenu();
        });
    })
}

// End connection and exit program
function exit() {
    connection.end();
}

// Build manager display table, might move to a module
function buildDisplayTable(data) {
    const dataTable = [["Item ID", "Product Name", "Department", "Sale Price", "Stock Quantity"]];
    data.forEach(row => {
        dataTable.push([row.id, row.product_name, row.department_name, "$" + row.price, row.stock_quantity])
    });
    return table(dataTable);
}

// Connect to DB and run
connection.connect(err => {
    if (err) throw err;
    managerMenu();
});
