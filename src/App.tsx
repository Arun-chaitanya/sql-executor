import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QueryInput from "./components/QueryInput";
import QueryResult from "./components/QueryResult";
import { executeQuery, getAllTablesData } from "./server/mockServer";
import "./AppContainer.css";
import EditFavorites from "./components/EditFavorites";

interface RowData {
  [key: string]: string | number;
}

const PREDEFINED_QUERIES = [
  "SELECT * FROM regions",
  "SELECT productName, unitPrice FROM products",
  "SELECT * FROM customers WHERE country = 'Germany'",
  // Add more predefined queries here
];

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [allTablesData, setAllTablesData] = useState<
    { tableName: string; data: RowData[] }[]
  >([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedFavoriteQuery, setSelectedFavoriteQuery] =
    useState<string>("");
  const [customQuery, setCustomQuery] = useState<string>("");
  const [customQueryResult, setCustomQueryResult] = useState<RowData[]>([]);
  const [paginationStart, setPaginationStart] = useState<number>(0);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [isTablesLoading, setIsTablesLoading] = useState<boolean>(false);

  const [favoritesQueries, setFavoritesQueries] = useState<string[]>([]);
  const [isEditingFavoriteQueries, setIsEditingFavoriteQueries] =
    useState<boolean>(false);
  const [isInitQuery, setIsInitQuery] = useState<boolean>(false);
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchTables() {
    try {
      setIsTablesLoading(true);
      const data = await getAllTablesData(paginationStart);
      await sleep(500);
      if (data.length < 2) setLoadMore(false);
      setPaginationStart(paginationStart + 2);
      setAllTablesData([...allTablesData, ...data]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTablesLoading(false);
    }
  }

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteQueries");
    const storedFavoritesArray = JSON.parse(storedFavorites || "[]");
    if (storedFavoritesArray.length) {
      setFavoritesQueries(storedFavoritesArray);
    } else {
      setFavoritesQueries(PREDEFINED_QUERIES);
      localStorage.setItem(
        "favoriteQueries",
        JSON.stringify(PREDEFINED_QUERIES)
      );
    }
    return () => saveFavoritesToLocalStorage(favoritesQueries);
  }, []);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectedTableParam = searchParams.get("selectedTable");
    const selectedFavoriteQueryParam = searchParams.get(
      "selectedFavoriteQuery"
    );
    const customQueryParam = searchParams.get("customQuery");

    if (selectedTableParam) {
      setSelectedTable(selectedTableParam);
    } else if (selectedFavoriteQueryParam) {
      setSelectedFavoriteQuery(selectedFavoriteQueryParam);
    } else if (customQueryParam) {
      setCustomQuery(customQueryParam);
    }
    if (searchParams || selectedTableParam || selectedFavoriteQueryParam) {
      setIsInitQuery(true);
    }
  }, []);

  useEffect(() => {
    if (isInitQuery) {
      (async () => {
        await handleExecuteCustomQuery();
        setIsInitQuery(false);
      })();
    }
  }, [isInitQuery]);

  const handleTableSelect = (table: string) => {
    setSelectedTable(table);
  };

  const handleFavoriteQuerySelect = (query: string) => {
    setSelectedFavoriteQuery(query);
  };

  const handleCustomQueryChange = (query: string) => {
    setCustomQuery(query);
  };

  const saveFavoritesToLocalStorage = (favorites: string[]) => {
    localStorage.setItem("favoriteQueries", JSON.stringify(favorites));
  };

  const saveFavorites = (favorites: string[]) => {
    setFavoritesQueries(favorites);
    saveFavoritesToLocalStorage(favorites);
  };

  const handleAddFavorite = (favoriteQuery: string) => {
    saveFavorites([...favoritesQueries, favoriteQuery]);
  };

  const handleExecuteCustomQuery = async () => {
    const searchParams = new URLSearchParams();
    const query = customQuery || selectedFavoriteQuery || selectedTable;
    let key = "";
    if (selectedTable) key = "selectedTable";
    else if (selectedFavoriteQuery) key = "selectedFavoriteQuery";
    else if (customQuery) key = "customQuery";
    if (query) {
      try {
        const result = await executeQuery(query, !!selectedTable);
        if (result.statusCode === 200) {
          setCustomQueryResult(result.data);
        }
        searchParams.set(key, query);
        navigate({ search: searchParams.toString() });
      } catch (error) {
        console.error("Error executing custom query:", error);
      }
    }
  };

  return (
    <div className="appContainer">
      <h1>SQL Query App</h1>
      {isEditingFavoriteQueries ? (
        <EditFavorites
          favorites={favoritesQueries}
          onAddFavorite={handleAddFavorite}
          saveFavorites={saveFavorites}
          setIsFavoritesEditing={setIsEditingFavoriteQueries}
        />
      ) : (
        <>
          <QueryInput
            selectedTable={selectedTable}
            setSelectedTable={handleTableSelect}
            selectedFavoriteQuery={selectedFavoriteQuery}
            setSelectedFavoriteQuery={handleFavoriteQuerySelect}
            customQuery={customQuery}
            setCustomQuery={handleCustomQueryChange}
            handleExecuteCustomQuery={handleExecuteCustomQuery}
            favoriteQueries={favoritesQueries}
            setIsFavoritesEditing={setIsEditingFavoriteQueries}
          />
          <QueryResult
            tablesData={allTablesData}
            selectedTable={selectedTable}
            selectedFavoriteQuery={selectedFavoriteQuery}
            customQueryResult={customQueryResult}
            loadMore={loadMore}
            handleLoadMore={fetchTables}
            isTablesLoading={isTablesLoading}
          />
        </>
      )}
    </div>
  );
};

export default App;
