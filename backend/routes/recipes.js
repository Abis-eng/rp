const express = require('express');
const axios = require('axios');
const Recipe = require('../models/Recipe');
const router = express.Router();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || 'demo';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

function normalizeIngredientName(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

function scoreRecipeByIngredients(recipe, inputSet) {
  const recipeSet = new Set(
    (recipe.ingredients || []).map(i => normalizeIngredientName(i.name)).filter(Boolean)
  );
  let overlap = 0;
  for (const ing of inputSet) {
    if (recipeSet.has(ing)) overlap += 1;
  }
  const coverage = inputSet.size ? overlap / inputSet.size : 0;
  // score weights: overlap first, then coverage
  return overlap * 10 + coverage;
}

// Helper function to map difficulty
const mapDifficulty = (readyInMinutes) => {
  if (readyInMinutes <= 30) return 'Easy';
  if (readyInMinutes <= 60) return 'Medium';
  return 'Hard';
};

// Match recipes from ADMIN database using ingredients (no Spoonacular needed)
// returns sorted matches + random picks from top results
router.post('/match', async (req, res) => {
  try {
    const { ingredients, limit = 10, random = 3 } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Please provide ingredients array' });
    }

    const inputSet = new Set(
      ingredients.map(normalizeIngredientName).filter(Boolean)
    );

    const all = await Recipe.find({ source: 'admin' }).limit(500);
    if (all.length === 0) {
      return res.status(404).json({ message: 'No admin recipes found. Admin must add recipes first.' });
    }

    const scored = all
      .map(r => ({ r, score: scoreRecipeByIngredients(r, inputSet) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const top = scored.slice(0, Math.max(1, Number(limit) || 10)).map(x => x.r);
    if (top.length === 0) {
      return res.status(404).json({ message: 'No similar recipes found for your ingredients.' });
    }

    // random picks from top
    const randomCount = Math.min(Number(random) || 0, top.length);
    const picks = [];
    const used = new Set();
    while (picks.length < randomCount) {
      const idx = Math.floor(Math.random() * top.length);
      if (used.has(idx)) continue;
      used.add(idx);
      picks.push(top[idx]);
    }

    return res.json({
      matches: top,
      random: picks
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

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

    if (recipes.length === 0) {
      return res.status(404).json({ 
        message: 'No recipes found with those ingredients. Try different ingredients.' 
      });
    }

    res.json(recipes);
  } catch (error) {
    console.error('Recipe generation error:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(500).json({ 
        message: 'Invalid API key. Please check your Spoonacular API key in .env file.' 
      });
    }
    
    if (error.response?.status === 402) {
      return res.status(500).json({ 
        message: 'API quota exceeded. Please check your Spoonacular API plan.' 
      });
    }

    res.status(500).json({ 
      message: 'Error generating recipes. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

