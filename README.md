# SQL Executor App

## Packages which are used for this app

```js
    "papaparse": "^5.4.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-loader-spinner": "^5.3.4",
    "react-router-dom": "^6.14.2",
    "react-table": "^7.8.0",
    "sweetalert2": "^11.7.20",
    "@uiw/react-textarea-code-editor": "^2.1.7",
```
## Details about the app

1) This app by default renders all the tables available.
2) The rows are horizontally scrollable.
3) It can execute SQL queries to query the result(The results are mock).
4) It has the ability to save SQL queries to your favourite SQL queries list.
5) You can also edit/delete the SQL queries in your favourite list.
6) The favourite list is persisted. So even if you reload, you will have the same favourite list.
7) The current stage of the app is also persisted using searchParams. So let us say you have searched for a query, and you reload, you can still see the same results.
8) As the state is persisted with the help of URL searchParams, you can share the link of the app, any they will be able to see the same results.
9) I have hashed the queries, so that even though the data is mock data, for a particular query, you will see the result.
10) The loaders are added for better UI/UX queue.
11) I have manually added some QUERIES, for which the app will say that the queries are invalid. Those are as following
```js
const FAILING_QUERIES = [
  "UPDATE employees SET department = 'HR' WHERE salary > 50000;",
  "INSERT INTO products (productName, unitPrice, categoryID) VALUES ('Widget', 10.99, 1);",
  "DELETE FROM customers WHERE lastPurchaseDate < '2023-01-01';",
  "CREATE TABLE orders (orderID INT, customerID INT, orderDate DATE);",
  "DROP TABLE products;",
  "ALTER TABLE employees ADD COLUMN jobTitle VARCHAR(50);",
  "CREATE INDEX idx_product_name ON products (productName);",
  "SELECT firstName, lastName FROM employees WHERE jobTitle = 'Manager';",
  "UPDATE orders SET orderStatus = 'Shipped' WHERE orderDate BETWEEN '2023-01-01' AND '2023-06-30';",
  "DELETE FROM suppliers WHERE country = 'China';",
];
```
## JavaScript framework you chose: React+TS

## page load time of application
I have used Google Chrome Lighthouse extension to calculate the load time of my application.
<img width="1440" alt="Screenshot 2023-07-23 at 7 18 28 PM" src="https://github.com/Arun-chaitanya/sql-executor/assets/44457256/e30db2af-59fd-4197-93ca-573934ea091f">
<img width="1440" alt="Screenshot 2023-07-23 at 7 18 28 PM" src="https://github.com/Arun-chaitanya/sql-executor/assets/44457256/b371c949-96fd-4429-8baa-ecaf0af45f94">


## Optimisations
I have added paginations when we view all the tables.
Those list are persisted in state, so that even though you come back to the list after the queries, you will not have to again load the previously loaded tables.
