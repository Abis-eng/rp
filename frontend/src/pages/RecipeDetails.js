import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecipe();
    if (token) {
      checkFavorite();
    }
  }, [id, token]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      alert('Recipe not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`/api/favorites/check/${id}`);
      setIsFavorited(response.data.isFavorited);
    } catch (error) {
      console.error('Error checking favorite:', error);
      setIsFavorited(false);
    }
  };

  const toggleFavorite = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      if (isFavorited) {
        await axios.delete(`/api/favorites/${id}`);
        setIsFavorited(false);
      } else {
        await axios.post(`/api/favorites/${id}`);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error saving favorite');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!recipe) {
    return <div className="container">Recipe not found</div>;
  }

  return (
    <div className="container">
      <div className="recipe-details">
        <div className="recipe-header">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Back
          </button>
          <button
            onClick={toggleFavorite}
            disabled={saving}
            className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          >
            {isFavorited ? <FaHeart /> : <FaRegHeart />}
            {isFavorited ? ' Remove from Favorites' : ' Add to Favorites'}
          </button>
        </div>

        <div className="recipe-main">
          <div className="recipe-image-section">
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
            )}
          </div>

          <div className="recipe-info">
            <h1>{recipe.title}</h1>
            
            <div className="recipe-stats">
              <div className="stat">
                <span className="stat-label">Cooking Time</span>
                <span className="stat-value">⏱️ {recipe.cookingTime} minutes</span>
              </div>
              <div className="stat">
                <span className="stat-label">Servings</span>
                <span className="stat-value">👥 {recipe.servings}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Difficulty</span>
                <span className={`stat-value difficulty difficulty-${recipe.difficulty.toLowerCase()}`}>
                  {recipe.difficulty}
                </span>
              </div>
              {recipe.cuisine && (
                <div className="stat">
                  <span className="stat-label">Cuisine</span>
                  <span className="stat-value">📍 {recipe.cuisine}</span>
                </div>
              )}
            </div>

            {recipe.dietType && recipe.dietType.length > 0 && (
              <div className="diet-tags">
                {recipe.dietType.map((diet, index) => (
                  <span key={index} className="diet-tag">{diet}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="recipe-sections">
          <div className="section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </li>
                ))
              ) : (
                <li>No ingredients listed</li>
              )}
            </ul>
          </div>

          <div className="section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((step, index) => (
                  <li key={index}>{step.instruction}</li>
                ))
              ) : (
                <li>No instructions available</li>
              )}
            </ol>
          </div>
        </div>

        {recipe.sourceUrl && (
          <div className="source-link">
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              View Original Recipe
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;


