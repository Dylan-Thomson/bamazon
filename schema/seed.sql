USE bamazon;

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Iron Plate", "Materials", 147.71, 100);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Copper Plate", "Materials", 365.18, 100);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Burner Drill", "Mining", 1846.39, 10);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Electric Drill", "Mining", 5040.64, 10);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Stone Furnace", "Smelting", 487.28, 10);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Steel Furnace", "Smelting", 5642.98, 10);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Transport Belt", "Logistics", 253.64, 50);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Burner Inserter", "Logistics", 443.13, 20);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Inserter", "Logistics", 1321.20, 20);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Pipe", "Logistics", 177.31, 20);

INSERT INTO departments(department_name, over_head_costs)
VALUES ("Materials", 10000);

INSERT INTO departments(department_name, over_head_costs)
VALUES ("Mining", 15000);

INSERT INTO departments(department_name, over_head_costs)
VALUES ("Smelting", 20000);

INSERT INTO departments(department_name, over_head_costs)
VALUES ("Logistics", 25000);

SELECT * FROM products;
SELECT * FROM departments;