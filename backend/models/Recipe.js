const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  recipeId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  ingredients: [{
    name: String,
    amount: String,
    unit: String
  }],
  instructions: [{
    step: Number,
    instruction: String
  }],
  cookingTime: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  cuisine: {
    type: String
  },
  dietType: [{
    type: String
  }],
  sourceUrl: {
    type: String
  },
  source: {
    type: String,
    enum: ['admin', 'spoonacular'],
    default: 'admin'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);




