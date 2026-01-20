const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add recipe to favorites
router.post('/:recipeId', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ recipeId: parseInt(req.params.recipeId) });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(req.user._id);
    
    if (user.favorites.includes(recipe._id)) {
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    user.favorites.push(recipe._id);
    await user.save();

    res.json({ message: 'Recipe added to favorites', recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove recipe from favorites
router.delete('/:recipeId', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ recipeId: parseInt(req.params.recipeId) });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      favId => favId.toString() !== recipe._id.toString()
    );
    await user.save();

    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if recipe is favorited
router.get('/check/:recipeId', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ recipeId: parseInt(req.params.recipeId) });
    
    if (!recipe) {
      return res.json({ isFavorited: false });
    }

    const user = await User.findById(req.user._id);
    const isFavorited = user.favorites.includes(recipe._id);
    
    res.json({ isFavorited });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;




