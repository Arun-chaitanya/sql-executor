import { readCSV } from "../utils/csvReader";

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
  } else {
    // For non-SELECT queries, generate a hash number between 1 and 10
    const hashNumber = Math.floor((hashCode(query) % 10) + 1);

    // Retrieve the corresponding table name from the predefined list
    const tableNames = getAllTableNames();
    const tableName = tableNames[hashNumber - 1];

    // Fetch the data for the selected table
    const result = await readCSV(tableName);
    return result;
  }
};

// Helper function to generate a hash code from a string
function hashCode(str: string) {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export { executeQuery, getAllTablesData };
