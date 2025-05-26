const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');


exports.getAll = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('ingredients.ingredient');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('ingredients.ingredient');
    if (!recipe) return res.status(404).json({ message: 'Not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  console.log("Recipe request body:", req.body);
  try {
    const recipeName = req.body.name?.trim().toLowerCase();
    const { description, ingredients, steps } = req.body;


    const existingRecipe = await Recipe.findOne({ name: recipeName });

    if (existingRecipe) {
      return res.status(400).json({ message: "Recipe already exists." });
    }

    const processedIngredients = await Promise.all(
      ingredients.map(async (item) => {
        const ingredientName = item.name.toLowerCase().trim();
        const unit = item.unit.toLowerCase().trim();

        let existing = await Ingredient.findOne({ name: ingredientName });

        if (!existing) {
          existing = await Ingredient.create({ name: ingredientName, unit });
        }

        return {
          ingredient: existing._id,
          quantity: item.quantity
        };
      })
    );

    const newRecipe = await Recipe.create({
      name: recipeName,
      description,
      ingredients: processedIngredients,
      steps
    });

      res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
