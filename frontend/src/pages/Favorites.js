import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      alert('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      await axios.delete(`/api/favorites/${recipeId}`);
      setFavorites(favorites.filter(recipe => recipe.recipeId !== recipeId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing favorite');
    }
  };

  if (loading) {
    return <div className="container">Loading favorites...</div>;
  }

  return (
    <div className="container">
      <div className="favorites-header">
        <h1>My Favorite Recipes</h1>
        {favorites.length === 0 && (
          <p className="no-favorites">You haven't saved any favorite recipes yet.</p>
        )}
      </div>

      <div className="favorites-grid">
        {favorites.map((recipe) => (
          <div key={recipe.recipeId} className="favorite-card">
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title} className="favorite-image" />
            )}
            <div className="favorite-content">
              <h3>{recipe.title}</h3>
              <div className="favorite-meta">
                <span>⏱️ {recipe.cookingTime} min</span>
                <span>👥 {recipe.servings} servings</span>
                <span className={`difficulty difficulty-${recipe.difficulty?.toLowerCase()}`}>
                  {recipe.difficulty}
                </span>
              </div>
              <div className="favorite-actions">
                <Link to={`/recipe/${recipe.recipeId}`} className="btn btn-primary">
                  View Recipe
                </Link>
                <button
                  onClick={() => removeFavorite(recipe.recipeId)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;




