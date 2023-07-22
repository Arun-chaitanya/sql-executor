import React, { useEffect, useState } from "react";
import { RowData } from "../utils/csvReader";
import { executeQuery } from "../server/mockServer";
import Table from "./Table";

interface TableData {
  tableName?: string;
  data: RowData[];
}

interface QueryResultProps {
  tablesData: TableData[];
  selectedTable: string;
  selectedFavoriteQuery: string;
  customQueryResult: RowData[];
}

const QueryResult: React.FC<QueryResultProps> = ({
  tablesData,
  selectedTable,
  selectedFavoriteQuery,
  customQueryResult,
}) => {
  const [displayedResult, setDisplayedResult] = useState<TableData | null>(
    null
  );

  useEffect(() => {
    if (
      !selectedTable &&
      !selectedFavoriteQuery &&
      customQueryResult.length === 0
    ) {
      // If no specific table is selected, no favorite query is selected, and no custom query is executed
      // Display all tables one after another
      setDisplayedResult(null); // Reset to show all tables
    } else if (selectedTable) {
      // Check if a specific table is selected from the dropdown
      const tableData = tablesData.find(
        (table) => table.tableName === selectedTable
      );
      if (tableData) {
        setDisplayedResult(tableData);
      }
    } else if (selectedFavoriteQuery) {
      // Check if a favorite query is selected from the dropdown
      executeFavoriteQuery(selectedFavoriteQuery);
    }
  }, [selectedTable, selectedFavoriteQuery, customQueryResult, tablesData]);

  useEffect(() => {
    // Check if customQueryResult is available (i.e., custom query was executed)
    if (customQueryResult.length > 0) {
      setDisplayedResult({ data: customQueryResult });
    }
  }, [customQueryResult]);

  const executeFavoriteQuery = async (query: string) => {
    try {
      const result = await executeQuery(query);
      setDisplayedResult({ data: result });
    } catch (error) {
      console.error("Error executing favorite query:", error);
    }
  };

  return (
    <div className="resultsContainer">
      <h2>{displayedResult ? "Query Result" : "All Tables"}</h2>
      {displayedResult ? (
        <Table
          tableName={displayedResult.tableName}
          data={displayedResult.data}
        />
      ) : (
        tablesData.map((tableData, index) => (
          <Table
            key={index}
            tableName={tableData.tableName}
            data={tableData.data}
          />
        ))
      )}
    </div>
  );
};

export default QueryResult;
