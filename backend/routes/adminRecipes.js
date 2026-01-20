const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const Recipe = require('../models/Recipe');

const router = express.Router();

function makeRecipeId() {
  // Keeps compatibility with existing frontend routes that use recipeId (number)
  return Date.now() + Math.floor(Math.random() * 1000);
}

// Admin: list recipes (only admin-created by default)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { source } = req.query;
    const q = {};
    if (source) q.source = source;
    const recipes = await Recipe.find(q).sort({ createdAt: -1 }).limit(200);
    res.json(recipes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: create recipe
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      title,
      image,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      servings,
      cuisine,
      dietType
    } = req.body;

    if (!title || !Array.isArray(ingredients) || ingredients.length === 0 || !Array.isArray(instructions) || instructions.length === 0) {
      return res.status(400).json({ message: 'title, ingredients[], instructions[] are required' });
    }
    if (!cookingTime || !difficulty || !servings) {
      return res.status(400).json({ message: 'cookingTime, difficulty, servings are required' });
    }

    const normalizedIngredients = ingredients
      .map(i => ({
        name: String(i.name || '').trim(),
        amount: i.amount != null ? String(i.amount).trim() : '',
        unit: i.unit != null ? String(i.unit).trim() : ''
      }))
      .filter(i => i.name.length > 0);

    const normalizedInstructions = instructions
      .map((s, idx) => ({
        step: Number(s.step || idx + 1),
        instruction: String(s.instruction || '').trim()
      }))
      .filter(s => s.instruction.length > 0);

    const recipe = await Recipe.create({
      recipeId: makeRecipeId(),
      title: String(title).trim(),
      image: image ? String(image).trim() : '',
      ingredients: normalizedIngredients,
      instructions: normalizedInstructions,
      cookingTime: Number(cookingTime),
      difficulty,
      servings: Number(servings),
      cuisine: cuisine ? String(cuisine).trim() : '',
      dietType: Array.isArray(dietType) ? dietType.map(d => String(d).trim()).filter(Boolean) : [],
      source: 'admin',
      createdBy: req.user._id
    });

    res.status(201).json(recipe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: update recipe (by recipeId)
router.put('/:recipeId', auth, adminOnly, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const recipe = await Recipe.findOne({ recipeId });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const up = { ...req.body };
    if (up.title) up.title = String(up.title).trim();
    if (up.image != null) up.image = String(up.image).trim();
    if (Array.isArray(up.ingredients)) {
      up.ingredients = up.ingredients
        .map(i => ({
          name: String(i.name || '').trim(),
          amount: i.amount != null ? String(i.amount).trim() : '',
          unit: i.unit != null ? String(i.unit).trim() : ''
        }))
        .filter(i => i.name.length > 0);
    }
    if (Array.isArray(up.instructions)) {
      up.instructions = up.instructions
        .map((s, idx) => ({
          step: Number(s.step || idx + 1),
          instruction: String(s.instruction || '').trim()
        }))
        .filter(s => s.instruction.length > 0);
    }

    const updated = await Recipe.findOneAndUpdate({ recipeId }, up, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: delete recipe (by recipeId)
router.delete('/:recipeId', auth, adminOnly, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const deleted = await Recipe.findOneAndDelete({ recipeId });
    if (!deleted) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


