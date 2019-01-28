const {table} = require("table");


function buildCustomerProductTable(data) {
    const dataTable = [["ID", "Product", "Price"]];
    data.forEach(row => {
        dataTable.push([row.id, row.product_name, "$" + row.price]);
    });
    
    return table(dataTable);
}

function buildManagerTable(data) {
    const dataTable = [["Item ID", "Product Name", "Department", "Sale Price", "Stock Quantity"]];
    data.forEach(row => {
        dataTable.push([row.id, row.product_name, row.department_name, "$" + row.price, row.stock_quantity])
    });
    return table(dataTable);
}

function buildProductSalesTable(data) {
    const dataTable = [["Department ID", "Department Name", "Overhead Costs", "Department Sales", "Total Profit"]];
    data.forEach(row => {
        dataTable.push([row.department_id, row.department_name, row.over_head_costs, row.department_sales, "$" + Number(row.total_profit).toFixed(2)]);
    });
    return table(dataTable);
}

module.exports = {
    buildCustomerProductTable: buildCustomerProductTable,
    buildManagerTable: buildManagerTable,
    buildProductSalesTable: buildProductSalesTable
}