# Bamazon

Bamazon is a CLI storefront powered by a [MySQL](https://www.npmjs.com/package/mysql) database and written in [Node.js](https://nodejs.org/en/). 

Customers are presented with a [table](https://www.npmjs.com/package/table) that displays available products (ID, Product Name, Price) for sale from the MySQL database. They are then prompted using [inquirer](https://www.npmjs.com/package/inquirer) to enter the ID number of the product they wish to purchase, followed by the quanitity. Bamazon queries the database to see if there is enough product stock to fulfill the order, and notifies the user if the order is too large to fill. Otherwise, it updates the stock quantity and sales columns of the product in the database and displays the purchase total to the customer.

Managers are presented with a list of options to choose from. They can `View Products for Sale`, which displays a table of every available product and its ID, name, price, department, and quantity. If the manager selects `View Low Inventory`, the application display a table containing all products with a stock quantity lower than five. Using `Add to Inventory`, a manager can select a product by ID and is prompted to enter a quantity to be added to the stock quantity of the product in the database. Finally, managers can select `Add New Product` to be prompted to enter all of the necessary values for inserting a new product into the `products` table. 

Supervisors have access to two functions: `View Product Sales by Department`, and `Create New Department`. The product sales table displays data for each department, including the ID, name, overhead costs, total sales, and total profit. This is accomplished by performing a join on the `department` and `product` tables, as well as calculating the value for `total_profit` which is actually not stored permanently in the database. Creating a new department prompts the supervisor to enter the name and overhead_costs before inserting the new data into the table.

## Challenges and Learning Experiences

Since I was dealing with three separate scripts for customers, managers, and supervisors, there was initially a lot of repetition between these scripts. It made sense to move a lot of this logic into separate files in import them as needed, so I created a modules folder with numerous utility scripts for connecting to the database, validating input, building the tables, etc. This really helped [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up the code and made the codebase easier to work with.

Although I was familiar working with promises in JavaScript, this is the first project where I actually decided to define some myself. Due to the asynchronous nature of database queries in Node, writing my own promises allowed me to, for example, wait until the products table is displayed before prompting the user for input. It took a bit of research (and a bit more trial and error) to get the hang of it, but once I figured out how to use `resolve()` and `reject()`, things started falling into place.

Finally, creating and working with the database required a great deal of research. While some queries, such as getting all the products from the database, were quite simple, the query to generate the supervisor table required knowledge of joins, calculating columns on the fly, and aliases to accomplish.

## Potential changes
* Give supervisors access to manager functions
* Create user accounts for all three tiers of users
* Incorporate this logic into a web page hosted on Heroku

## Packages used: 
* [inquirer](https://www.npmjs.com/package/inquirer) for prompting user input
* [table](https://www.npmjs.com/package/table) for displaying tabular data in terminal
* [dotenv](https://www.npmjs.com/package/dotenv) for hiding sensitive data from GitHub
* [mysql](https://www.npmjs.com/package/mysql) for connecting to and working with MySQL database
