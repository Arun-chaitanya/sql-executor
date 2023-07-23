import React, { useEffect, useState } from "react";
import { RowData } from "../../utils/csvReader";
import Table from "../Table/Table";
import { RotatingLines } from "react-loader-spinner";

interface TableData {
  tableName?: string;
  data: RowData[];
}

interface QueryResultProps {
  tablesData: TableData[];
  customQueryResult: RowData[];
  loadMore: boolean;
  isTablesLoading: boolean;
  isQueryLoading: boolean;
  handleLoadMore: () => void;
}

const QueryResult: React.FC<QueryResultProps> = ({
  tablesData,
  customQueryResult,
  loadMore,
  handleLoadMore,
  isTablesLoading,
  isQueryLoading,
}) => {
  const [displayedResult, setDisplayedResult] = useState<TableData | null>(
    null
  );

  useEffect(() => {
    // Check if customQueryResult is available (i.e., custom query was executed)
    if (customQueryResult.length > 0) {
      setDisplayedResult({ data: customQueryResult });
    }
  }, [customQueryResult]);

  if (isQueryLoading)
    return (
      <RotatingLines
        strokeColor="grey"
        strokeWidth="2"
        animationDuration="0.75"
        width="40"
        visible={true}
      />
    );
  return (
    <div className="resultsContainer">
      <h2>{displayedResult ? "Query Result" : "All Tables"}</h2>
      {displayedResult ? (
        <Table
          tableName={displayedResult.tableName}
          data={displayedResult.data}
        />
      ) : (
        <>
          {tablesData.map((tableData, index) => (
            <Table
              key={index}
              tableName={tableData.tableName}
              data={tableData.data}
            />
          ))}
          {loadMore &&
            (isTablesLoading ? (
              <RotatingLines
                strokeColor="grey"
                strokeWidth="2"
                animationDuration="0.75"
                width="40"
                visible={true}
              />
            ) : (
              <button className="queryInputButton" onClick={handleLoadMore}>
                Load More Tables
              </button>
            ))}
        </>
      )}
    </div>
  );
};

export default QueryResult;