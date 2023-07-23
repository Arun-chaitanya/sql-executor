import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "./QueryInput.css"; // Import the QueryInput.css file
import { getAllTableNames } from "../server/mockServer";

interface QueryInputProps {
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  selectedFavoriteQuery: string;
  setSelectedFavoriteQuery: (query: string) => void;
  customQuery: string;
  setCustomQuery: (query: string) => void;
  handleExecuteCustomQuery: () => void;
  favoriteQueries: string[];
  setIsFavoritesEditing: (isEditing: boolean) => void;
}

const QueryInput: React.FC<QueryInputProps> = (props) => {
  const {
    selectedTable,
    setSelectedTable,
    selectedFavoriteQuery,
    setSelectedFavoriteQuery,
    customQuery,
    setCustomQuery,
    handleExecuteCustomQuery,
    favoriteQueries,
    setIsFavoritesEditing,
  } = props;

  const handleTableSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(event.target.value);
    setSelectedFavoriteQuery("");
    setCustomQuery("");
  };

  const handleFavoriteQuerySelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFavoriteQuery(event.target.value);
    setSelectedTable("");
    setCustomQuery("");
  };

  const handleCustomQueryChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSelectedFavoriteQuery("");
    setSelectedTable("");
    setCustomQuery(e.target.value);
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
          {getAllTableNames().map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
        <button className="queryInputButton" onClick={handleExecuteCustomQuery}>
          Show Table
        </button>
      </div>

      <div>
        <select
          className="queryInputSelect"
          value={selectedFavoriteQuery}
          onChange={handleFavoriteQuerySelect}
        >
          <option value="">Select a favorite query</option>
          {favoriteQueries.map((query) => (
            <option key={query} value={query}>
              {query}
            </option>
          ))}
        </select>
        <button className="queryInputButton" onClick={handleExecuteCustomQuery}>
          Execute Favorite Query
        </button>
        <button
          className="queryInputButton"
          onClick={() => setIsFavoritesEditing(true)}
        >
          Edit Queries
        </button>
      </div>

      <div>
        <CodeEditor
          language="sql"
          value={customQuery}
          onChange={handleCustomQueryChange}
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
