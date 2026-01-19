import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    cookingTime: '',
    difficulty: '',
    dietType: ''
  });

  const handleGenerateRecipes = async () => {
    if (!ingredients.trim()) {
      alert('Please enter ingredients');
      return;
    }

    setLoading(true);
    try {
      const ingredientsArray = ingredients.split(',').map(i => i.trim());
      const response = await axios.post('/api/recipes/generate', { ingredients: ingredientsArray });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert('Error generating recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(filters.cookingTime && { cookingTime: filters.cookingTime }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.dietType && { dietType: filters.dietType })
      });

      const response = await axios.get(`/api/recipes/search?${params}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error searching recipes:', error);
      alert('Error searching recipes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="home-header">
        <h1>Find Your Perfect Recipe</h1>
        
        <div className="search-section">
          <div className="ingredient-input">
            <h3>Generate Recipes from Ingredients</h3>
            <textarea
              placeholder="Enter ingredients separated by commas (e.g., chicken, tomatoes, onions)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="input"
              rows="3"
            />
            <button 
              onClick={handleGenerateRecipes} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Recipes'}
            </button>
          </div>

          <div className="search-input">
            <h3>Search Recipes</h3>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by recipe name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="btn btn-secondary" disabled={loading}>
                Search
              </button>
            </div>

            <div className="filters">
              <select
                value={filters.cookingTime}
                onChange={(e) => setFilters({ ...filters, cookingTime: e.target.value })}
                className="input filter-select"
              >
                <option value="">All Cooking Times</option>
                <option value="30">≤ 30 minutes</option>
                <option value="60">≤ 60 minutes</option>
                <option value="90">≤ 90 minutes</option>
                <option value="120">≤ 2 hours</option>
              </select>

              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="input filter-select"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={filters.dietType}
                onChange={(e) => setFilters({ ...filters, dietType: e.target.value })}
                className="input filter-select"
              >
                <option value="">All Diet Types</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten Free</option>
                <option value="ketogenic">Ketogenic</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="recipes-grid">
        {recipes.length === 0 && !loading && (
          <div className="no-recipes">
            <p>Enter ingredients or search for recipes to get started!</p>
          </div>
        )}
        
        {loading && (
          <div className="loading">Loading recipes...</div>
        )}

        {recipes.map((recipe) => (
          <div key={recipe.recipeId} className="recipe-card">
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            )}
            <div className="recipe-content">
              <h3>{recipe.title}</h3>
              <div className="recipe-meta">
                <span>⏱️ {recipe.cookingTime} min</span>
                <span>👥 {recipe.servings} servings</span>
                <span className={`difficulty difficulty-${recipe.difficulty.toLowerCase()}`}>
                  {recipe.difficulty}
                </span>
              </div>
              {recipe.cuisine && <p className="cuisine">📍 {recipe.cuisine}</p>}
              <Link to={`/recipe/${recipe.recipeId}`} className="btn btn-primary">
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

