import React, { useState } from "react";

interface EditFavoritesProps {
  favorites: string[];
  onAddFavorite: (favoriteQuery: string) => void;
  saveFavorites: (favorites: string[]) => void;
  setIsFavoritesEditing: (isEditing: boolean) => void;
}

const EditFavorites: React.FC<EditFavoritesProps> = ({
  favorites,
  onAddFavorite,
  saveFavorites,
  setIsFavoritesEditing,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedIndex, setEditedIndex] = useState<number>(-1);
  const [newFavoriteQuery, setNewFavoriteQuery] = useState<string>("");

  // Handler for removing a favorite query from the favorites list
  const onRemoveFavorite = (index: number) => {
    const updatedFavorites = [...favorites];
    updatedFavorites.splice(index, 1);
    saveFavorites(favorites);
  };

  // Handler for updating a favorite query in the favorites list
  const onUpdateFavorite = (index: number, updatedQuery: string) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = updatedQuery;
    saveFavorites(updatedFavorites);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleStopEditing = () => {
    setIsEditing(false);
    setEditedIndex(-1);
    setNewFavoriteQuery("");
  };

  const handleAddFavorite = () => {
    onAddFavorite(newFavoriteQuery);
    setNewFavoriteQuery("");
  };

  const handleEditFavorite = (index: number) => {
    setEditedIndex(index);
    setNewFavoriteQuery(favorites[index]);
    setIsEditing(true);
  };

  const handleUpdateFavorite = () => {
    if (editedIndex >= 0 && editedIndex < favorites.length) {
      onUpdateFavorite(editedIndex, newFavoriteQuery);
      setNewFavoriteQuery("");
      setEditedIndex(-1);
      setIsEditing(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newFavoriteQuery}
            onChange={(e) => setNewFavoriteQuery(e.target.value)}
          />
          {editedIndex >= 0 ? (
            <button onClick={handleUpdateFavorite}>Save</button>
          ) : (
            <button onClick={handleAddFavorite}>Add</button>
          )}
          <button onClick={handleStopEditing}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>Favorites:</h2>
          <ul>
            {favorites.map((query, index) => (
              <li key={index}>
                {query}
                <button onClick={() => handleEditFavorite(index)}>Edit</button>
                <button onClick={() => onRemoveFavorite(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={handleStartEditing}>Add Favorite</button>
        </div>
      )}
      <button onClick={() => setIsFavoritesEditing(false)}>Done</button>
    </div>
  );
};

export default EditFavorites;
