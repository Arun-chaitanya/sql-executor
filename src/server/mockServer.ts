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
  "update employees set department = 'hr' where salary > 50000;",
  "insert into products (productname, unitprice, categoryid) values ('widget', 10.99, 1);",
  "delete from customers where lastpurchasedate < '2023-01-01';",
  "create table orders (orderid int, customerid int, orderdate date);",
  "drop table products;",
  "alter table employees add column jobtitle varchar(50);",
  "create index idx_product_name on products (productname);",
  "select firstname, lastname from employees where jobtitle = 'manager';",
  "update orders set orderstatus = 'shipped' where orderdate between '2023-01-01' and '2023-06-30';",
  "delete from suppliers where country = 'china';",
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

  console.log(trimmedQuery);
  if (FAILING_QUERIES.includes(trimmedQuery.toLowerCase())) {
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

    const tableNames = getAllTableNames();
    const tableName = tableNames[hashNumber - 1];

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
