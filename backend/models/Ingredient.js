const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  unit: {
    type: String,
    enum: ['g', 'ml', 'pcs', 'units', 'packs', 'tbsp', 'tsp', 'cup', 'pinch'], 
    required: true,
  }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
