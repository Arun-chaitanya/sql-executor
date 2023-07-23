import { readCSV } from "../utils/csvReader";

export const getAllTableNames = () => {
  const tableNames = [
    "categories",
    "customers",
    "employee_territories",
    "employees",
    "order_details",
    "orders",
    "products",
    "regions",
    "shippers",
    "suppliers",
    "territories",
  ];
  return tableNames;
};

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

const getAllTablesData = async (start: number, size = 2) => {
  const tableNames = getAllTableNames();
  const allTablesData = [];

  for (const tableName of tableNames.slice(start, start + size)) {
    try {
      const data = await readCSV(tableName);
      allTablesData.push({ tableName, data });
    } catch (error) {
      console.error("Error loading table:", tableName, error);
    }
  }

  return allTablesData;
};

const executeQuery = async (query: string, isTableSearch = false) => {
  const trimmedQuery = query.trim().toLowerCase();

  if (isTableSearch) {
    const result = await readCSV(query);
    return { statusCode: 200, data: result };
  }

  if (FAILING_QUERIES.includes(trimmedQuery)) {
    return { statusCode: 400, data: [] };
  }

  if (trimmedQuery.startsWith("select")) {
    const tableNameMatch = trimmedQuery.match(/from\s+(\w+)/);
    if (!tableNameMatch) {
      return { statusCode: 400, data: [] };
    }

    const tableName = tableNameMatch[1];
    const result = await readCSV(tableName);
    return { statusCode: 200, data: result };
  } else {
    // For non-SELECT queries, generate a hash number between 1 and 10
    const hashNumber = Math.floor((hashCode(query) % 10) + 1);

    // Retrieve the corresponding table name from the predefined list
    const tableNames = getAllTableNames();
    const tableName = tableNames[hashNumber - 1];

    // Fetch the data for the selected table
    const result = await readCSV(tableName);
    return { statusCode: 200, data: result };
  }
};

// Helper function to generate a hash code from a string
function hashCode(str: string) {
  const hash = str.length % 10;
  return hash;
}

export { executeQuery, getAllTablesData };
