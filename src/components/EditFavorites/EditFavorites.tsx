import React, { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "./EditFavorites.css";

interface EditFavoritesProps {
  favorites: string[];
  saveFavorites: (favorites: string[]) => void;
  setIsFavoritesEditing: (isEditing: boolean) => void;
}

const EditFavorites: React.FC<EditFavoritesProps> = ({
  favorites,
  saveFavorites,
  setIsFavoritesEditing,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedIndex, setEditedIndex] = useState<number>(-1);
  const [newFavoriteQuery, setNewFavoriteQuery] = useState<string>("");

  //remove query from favorite list when clicked on "REMOVE"
  const onRemoveFavorite = (index: number) => {
    const updatedFavorites = [...favorites];
    updatedFavorites.splice(index, 1);
    saveFavorites(favorites);
  };

  //generic function to update favorite list
  const onUpdateFavorite = (index: number, updatedQuery: string) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = updatedQuery;
    saveFavorites(updatedFavorites);
  };

  //function to go from editing mode to list view mode
  const handleStopEditing = () => {
    setIsEditing(false);
    setEditedIndex(-1);
    setNewFavoriteQuery("");
  };

  //function to start editing mode
  const handleEditFavorite = (index: number) => {
    setEditedIndex(index);
    setNewFavoriteQuery(favorites[index]);
    setIsEditing(true);
  };

  //function to confirm the save the edited query
  const handleUpdateFavorite = () => {
    if (
      editedIndex >= 0 &&
      editedIndex < favorites.length &&
      !favorites.includes(newFavoriteQuery)
    ) {
      onUpdateFavorite(editedIndex, newFavoriteQuery);
      setNewFavoriteQuery("");
    }
    setEditedIndex(-1);
    setIsEditing(false);
  };

  return (
    <>
      <div className="favoritesContainer">
        <h2>Favorites Queries</h2>
        <ul className="favoritesList">
          {favorites.map((query, index) =>
            isEditing && index === editedIndex ? (
              <div className="favoritesBox">
                <CodeEditor
                  language="sql"
                  value={newFavoriteQuery}
                  onChange={(e) => setNewFavoriteQuery(e.target.value)}
                  placeholder="Type your SQL query here..."
                  style={{
                    fontSize: 12,
                    backgroundColor: "",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  }}
                  className="favoritesEditInput"
                />
                <div className="favoritesBtnContainer">
                  <button onClick={handleUpdateFavorite}>Save</button>
                  <button onClick={handleStopEditing}>Cancel</button>
                </div>
              </div>
            ) : (
              <li key={index} className="favoritesBox">
                <p className="favoritesString">{query}</p>
                <div className="favoritesBtnContainer">
                  <button onClick={() => handleEditFavorite(index)}>
                    Edit
                  </button>
                  <button onClick={() => onRemoveFavorite(index)}>
                    Remove
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      </div>

      <button className="doneBtn" onClick={() => setIsFavoritesEditing(false)}>
        Done
      </button>
    </>
  );
};

export default EditFavorites;
