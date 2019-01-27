const connection = require("./connection");

// Validates whether input is a positive integer
function isPositiveInteger(input) {
    const number = Number(input);
    return Number.isInteger(number) && isPositiveNumber(input);
}

// Validates whether input is a positive number
function isPositiveNumber(input) {
    const number = Number(input);
    return String(number) === input && number > 0;
}

function validatePrice(input) {
    if(!isPositiveNumber(input)) {
        return "Please enter a number greater than zero."
    }
    return true;
}

// Make sure input is an integer greater than zero
function validateQuantity(input) {
    if(!isPositiveInteger(input)) {
        return "Please enter an integer number greater than zero.";
    }
    return true;
}

// Make sure input is an integer greater than zero - ID starts at 1
function validateID(input) {
    if(!isPositiveInteger(input)) {
        return "Please enter an integer number greater than zero.";
    }

    // Get number of rows - max ID cannot exceed number of rows
    const testID = new Promise((resolve, reject) => {
        connection.query("SELECT COUNT(*) FROM products", (err, res) => {
            if(err) reject(err);
            let result;
            if(Number(input) > res[0]["COUNT(*)"]) {
                result = "Item number not found.";
            }
            else {
                result = true;
            }
            resolve(result)
        });
    });

    return testID.then(result => result);
}

module.exports = {
    validateID: validateID,
    validateQuantity: validateQuantity,
    validatePrice: validatePrice
}