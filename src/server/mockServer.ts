import { readCSV, joinCSV } from "../utils/csvReader";

const getAllTableNames = () => {
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

const getAllTablesData = async () => {
  const tableNames = getAllTableNames();
  const allTablesData = [];

  for (const tableName of tableNames) {
    try {
      const data = await readCSV(tableName);
      allTablesData.push({ tableName, data });
    } catch (error) {
      console.error("Error loading table:", tableName, error);
    }
  }

  return allTablesData;
};

const executeQuery = async (query: string) => {
  const trimmedQuery = query.trim().toLowerCase();

  if (trimmedQuery.startsWith("select")) {
    const tableNameMatch = trimmedQuery.match(/from\s+(\w+)/);
    if (!tableNameMatch) {
      throw new Error("Invalid SELECT query. Table name is missing.");
    }

    const tableName = tableNameMatch[1];
    const result = await readCSV(tableName);
    return result;
  } else if (trimmedQuery.startsWith("join")) {
    const joinRegex = /join\s+(\w+)\s+on\s+(\w+)\s*=\s*(\w+)/;
    const joinMatch = trimmedQuery.match(joinRegex);
    if (!joinMatch) {
      throw new Error("Invalid JOIN query.");
    }

    const table1Name = joinMatch[1];
    const table2Name = joinMatch[2];
    const joinColumn = joinMatch[3];
    const result = await joinCSV(table1Name, table2Name, joinColumn);
    return result;
  } else {
    throw new Error(
      "Invalid query. Only SELECT and JOIN queries are supported."
    );
  }
};

export { executeQuery, getAllTablesData };
