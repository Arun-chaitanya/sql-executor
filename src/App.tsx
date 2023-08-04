import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QueryInput from "./components/QueryInput/QueryInput";
import QueryResult from "./components/QueryResult/QueryResult";
import { executeQuery, getAllTablesData } from "./server/mockServer";
import EditFavorites from "./components/EditFavorites/EditFavorites";
import { RotatingLines } from "react-loader-spinner";
import Swal from "sweetalert2";

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

  // all tables data
  const [allTablesData, setAllTablesData] = useState<
    { tableName: string; data: RowData[] }[]
  >([]);

  // all inputs data
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedFavoriteQuery, setSelectedFavoriteQuery] =
    useState<string>("");
  const [customQuery, setCustomQuery] = useState<string>("");

  //all inputs result
  const [customQueryResult, setCustomQueryResult] = useState<RowData[]>([]);

  //manange paginations
  const [paginationStart, setPaginationStart] = useState<number>(0);
  const [loadMore, setLoadMore] = useState<boolean>(true);

  //managing all inputs result loading
  const [isQueryLoading, setIsQueryLoading] = useState<boolean>(false);

  // managing favorite queries
  const [favoritesQueries, setFavoritesQueries] = useState<string[]>([]);
  const [isEditingFavoriteQueries, setIsEditingFavoriteQueries] =
    useState<boolean>(false);

  //managing initial page load functionalities like getting queries from params and init loading
  const [isInitQuery, setIsInitQuery] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(true);

  //sleep to mock the delay of api call
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //function to fetch all tables with pagination
  async function fetchTables() {
    try {
      setIsQueryLoading(true);
      const data = await getAllTablesData(paginationStart);
      await sleep(300);
      if (data.length < 2) setLoadMore(false);
      setPaginationStart(paginationStart + 2);
      setAllTablesData([...allTablesData, ...data]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsQueryLoading(false);
    }
  }

  //useEffect to manage initial page loading state
  useEffect(() => {
    if (customQueryResult.length || allTablesData.length) {
      setIsInitLoading(false);
    }
  }, [customQueryResult, allTablesData]);

  //getting cached favorite queries on initial page load
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

  //getting tables list on initial page load
  useEffect(() => {
    fetchTables();
  }, []);

  //if user lands with a shared url containing search params in it
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

  //handling input value changes
  const handleTableSelect = (table: string) => {
    setSelectedTable(table);
  };

  const handleFavoriteQuerySelect = (query: string) => {
    setSelectedFavoriteQuery(query);
  };

  const handleCustomQueryChange = (query: string) => {
    setCustomQuery(query);
  };

  //reusable function to save favorites to local storage
  const saveFavoritesToLocalStorage = (favorites: string[]) => {
    localStorage.setItem("favoriteQueries", JSON.stringify(favorites));
  };

  //reusable function to save all the favorite queries to the state
  const saveFavorites = (favorites: string[]) => {
    setFavoritesQueries(favorites);
    saveFavoritesToLocalStorage(favorites);
  };

  //adding a query to favorite queries
  const handleAddFavorite = () => {
    if (customQuery && !favoritesQueries.includes(customQuery))
      saveFavorites([...favoritesQueries, customQuery]);
  };

  //function to execute any type of query
  const handleExecuteCustomQuery = async () => {
    setIsQueryLoading(true);
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
        } else {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "You have executed a invalid query!",
            showConfirmButton: false,
            timer: 1000,
          });
        }
        await sleep(300);
        searchParams.set(key, query);
        navigate({ search: searchParams.toString() });
      } catch (error) {
        console.error("Error executing custom query:", error);
      } finally {
        setIsQueryLoading(false);
      }
    }
  };

  //resetting everything to show the all tables view
  const handleShowAllTables = () => {
    setIsQueryLoading(true);
    const searchParams = new URLSearchParams();
    setCustomQueryResult([]);
    setCustomQuery("");
    setSelectedTable("");
    setSelectedFavoriteQuery("");
    searchParams.delete;
    navigate({ search: searchParams.toString() });
    setIsQueryLoading(false);
  };

  //ui for full page loading state
  if (isInitLoading) {
    return (
      <div className="appCenterContainer">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="2"
          animationDuration="0.75"
          width="40"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="appContainer">
      <h1>SQL Query App</h1>
      {isEditingFavoriteQueries ? (
        <EditFavorites
          favorites={favoritesQueries}
          saveFavorites={saveFavorites}
          setIsFavoritesEditing={setIsEditingFavoriteQueries}
        />
      ) : (
        <>
          <QueryInput
            handleShowAllTables={handleShowAllTables}
            selectedTable={selectedTable}
            setSelectedTable={handleTableSelect}
            selectedFavoriteQuery={selectedFavoriteQuery}
            setSelectedFavoriteQuery={handleFavoriteQuerySelect}
            customQuery={customQuery}
            setCustomQuery={handleCustomQueryChange}
            handleExecuteCustomQuery={handleExecuteCustomQuery}
            favoriteQueries={favoritesQueries}
            setIsFavoritesEditing={setIsEditingFavoriteQueries}
            handleAddFavorite={handleAddFavorite}
            showAllTablesBtn={!!customQueryResult.length}
          />
          <QueryResult
            tablesData={allTablesData}
            customQueryResult={customQueryResult}
            loadMore={loadMore}
            handleLoadMore={fetchTables}
            isTablesLoading={
              isQueryLoading &&
              !selectedFavoriteQuery &&
              !selectedTable &&
              !customQuery
            }
            isQueryLoading={
              isQueryLoading &&
              !!(selectedFavoriteQuery || selectedTable || customQuery)
            }
          />
        </>
      )}
    </div>
  );
};

export default App;
