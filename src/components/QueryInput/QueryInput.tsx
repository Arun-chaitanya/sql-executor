import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "./QueryInput.css";
import { getAllTableNames } from "../../server/mockServer";

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
  handleAddFavorite: () => void;
  handleShowAllTables: () => void;
  showAllTablesBtn: boolean;
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
    handleAddFavorite,
    handleShowAllTables,
    showAllTablesBtn,
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
      <div className="dropdownsContainer">
        <div className="queryBox">
          <p className="labelText">Show A Particular Table</p>
          <div className="flexRowContainer">
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
            <button
              className="queryInputButton"
              onClick={handleExecuteCustomQuery}
            >
              Show Table
            </button>
          </div>
        </div>

        <div className="queryBox">
          <p className="labelText">Select From Your Favorite Queries</p>
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
            <div className="bottomButton flexRowContainer">
              <button
                className="queryInputButton primaryBtn"
                onClick={handleExecuteCustomQuery}
              >
                Execute Favorite Query
              </button>
              <button
                className="queryInputButton"
                onClick={() => setIsFavoritesEditing(true)}
              >
                Edit Queries
              </button>
            </div>
          </div>
        </div>
        {showAllTablesBtn && (
          <div className="queryBox flexRowContainer">
            <button className="queryInputButton" onClick={handleShowAllTables}>
              Show All Tables
            </button>
          </div>
        )}
      </div>
      <div className="codeEditorContainer queryBox">
        <p className="labelText">Type Your Custom SQL Query</p>
        <CodeEditor
          language="sql"
          value={customQuery}
          onChange={handleCustomQueryChange}
          placeholder="Type your SQL query here..."
          className="codeEditorInput"
          style={{
            backgroundColor: "",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />

        {customQuery && (
          <div className="flexRowContainer bottomButton">
            <button
              className="queryInputButton"
              onClick={handleExecuteCustomQuery}
            >
              Execute Custom Query
            </button>

            <button className="queryInputButton" onClick={handleAddFavorite}>
              Add To Favorites
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryInput;
