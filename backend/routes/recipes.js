const express = require('express');
const axios = require('axios');
const Recipe = require('../models/Recipe');
const router = express.Router();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || 'demo';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Helper function to map difficulty
const mapDifficulty = (readyInMinutes) => {
  if (readyInMinutes <= 30) return 'Easy';
  if (readyInMinutes <= 60) return 'Medium';
  return 'Hard';
};

// Generate recipes from ingredients
router.post('/generate', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Please provide ingredients array' });
    }

    const ingredientsString = ingredients.join(',');
    
    // Call Spoonacular API
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/findByIngredients`, {
      params: {
        ingredients: ingredientsString,
        number: 10,
        apiKey: SPOONACULAR_API_KEY
      }
    });

    // Get detailed info for each recipe
    const recipeIds = response.data.map(recipe => recipe.id).join(',');
    const detailsResponse = await axios.get(`${SPOONACULAR_BASE_URL}/informationBulk`, {
      params: {
        ids: recipeIds,
        apiKey: SPOONACULAR_API_KEY
      }
    });

    // Format recipes
    const recipes = detailsResponse.data.map(recipe => ({
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image,
      cookingTime: recipe.readyInMinutes,
      difficulty: mapDifficulty(recipe.readyInMinutes),
      servings: recipe.servings,
      cuisine: recipe.cuisines?.[0] || 'International',
      dietType: recipe.diets || [],
      sourceUrl: recipe.sourceUrl,
      ingredients: recipe.extendedIngredients?.map(ing => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit
      })) || [],
      instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step, index) => ({
        step: index + 1,
        instruction: step.step
      })) || []
    }));

    // Save recipes to database
    for (const recipeData of recipes) {
      await Recipe.findOneAndUpdate(
        { recipeId: recipeData.recipeId },
        recipeData,
        { upsert: true, new: true }
      );
    }

    res.json(recipes);
  } catch (error) {
    console.error('Recipe generation error:', error.message);
    res.status(500).json({ 
      message: 'Error generating recipes',
      error: error.message 
    });
  }
});

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().limit(50).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search recipes by name
router.get('/search', async (req, res) => {
  try {
    const { query, cookingTime, difficulty, dietType } = req.query;

    let searchQuery = {};
    
    if (query) {
      searchQuery.title = { $regex: query, $options: 'i' };
    }
    
    if (cookingTime) {
      const maxTime = parseInt(cookingTime);
      searchQuery.cookingTime = { $lte: maxTime };
    }
    
    if (difficulty) {
      searchQuery.difficulty = difficulty;
    }
    
    if (dietType) {
      searchQuery.dietType = { $in: [dietType] };
    }

    const recipes = await Recipe.find(searchQuery).limit(20);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ recipeId: parseInt(req.params.id) });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

