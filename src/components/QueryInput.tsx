import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "./QueryInput.css"; // Import the QueryInput.css file

interface QueryInputProps {
  tables: string[]; // An array of all table names
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  selectedFavoriteQuery: string;
  setSelectedFavoriteQuery: (query: string) => void;
  customQuery: string;
  setCustomQuery: (query: string) => void;
  handleExecuteCustomQuery: () => void;
}

const QueryInput: React.FC<QueryInputProps> = ({
  tables,
  selectedTable,
  setSelectedTable,
  selectedFavoriteQuery,
  setSelectedFavoriteQuery,
  customQuery,
  setCustomQuery,
  handleExecuteCustomQuery,
}) => {
  const handleTableSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(event.target.value);
    setSelectedFavoriteQuery(""); // Reset the selected favorite query when a table is selected
  };

  const predefinedQueries = [
    "SELECT * FROM products",
    "SELECT productName, unitPrice FROM products",
    "SELECT * FROM customers WHERE country = 'Germany'",
    // Add more predefined queries here
  ];

  const handleFavoriteQuerySelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFavoriteQuery(event.target.value);
    setSelectedTable(""); // Reset the selected table when a favorite query is selected
  };

  const handleCustomQueryChange = (value: string) => {
    setCustomQuery(value);
  };

  return (
    <div className="queryInputContainer">
      <div>
        <select
          className="queryInputSelect"
          value={selectedTable}
          onChange={handleTableSelect}
        >
          <option value="">Select a table</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      <div>
        <select
          className="queryInputSelect"
          value={selectedFavoriteQuery}
          onChange={handleFavoriteQuerySelect}
        >
          <option value="">Select a favorite query</option>
          {predefinedQueries.map((query) => (
            <option key={query} value={query}>
              {query}
            </option>
          ))}
        </select>
        <button className="queryInputButton" onClick={handleExecuteCustomQuery}>
          Execute Favorite Query
        </button>
      </div>

      <div>
        <CodeEditor
          language="sql"
          value={customQuery}
          onChange={(e) => handleCustomQueryChange(e.target.value)}
          placeholder="Type your SQL query here..."
          style={{
            fontSize: 12,
            backgroundColor: "",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            minHeight: 200,
          }}
        />
        <button
          className="query-input-button"
          onClick={handleExecuteCustomQuery}
        >
          Execute Custom Query
        </button>
      </div>
    </div>
  );
};

export default QueryInput;
