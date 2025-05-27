const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');

exports.generateList = async (req, res) => {
  try {
    const { recipeIds } = req.body;

    const recipes = await Recipe.find({ _id: { $in: recipeIds } })
      .populate('ingredients.ingredient');

    const mergedIngredients = {};

    recipes.forEach(recipe => {
      recipe.ingredients.forEach(({ ingredient, quantity }) => {
        const key = ingredient._id.toString();

        if (!mergedIngredients[key]) {
          mergedIngredients[key] = {
            name: ingredient.name,
            unit: ingredient.unit,
            total: 0,
            id: key
          };
        }

        mergedIngredients[key].total += quantity;
      });
    });

    const finalList = Object.values(mergedIngredients);

    res.json(finalList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
