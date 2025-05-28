import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Recipes({ selectedRecipes, setSelectedRecipes }) {
  const [recipes, setRecipes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', ingredients: [{ name: '', quantity: '', unit: 'g' }] });
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded); 
    setIsAdmin(decoded.role === 'admin');
  }
}, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleSelect = (id) => {
    setSelectedRecipes((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((rid) => rid !== id)
        : [...prev, id];
      localStorage.setItem('selectedRecipes', JSON.stringify(updated));
      return updated;
    });
  };

  const handleFormChange = (e, idx = null, field = null) => {
    if (idx !== null) {
      const newIngredients = [...formData.ingredients];
      newIngredients[idx][field] = e.target.value;
      setFormData({ ...formData, ingredients: newIngredients });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addIngredientField = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '', unit: 'g' }]
    });
  };

  const handleIngredientSearch = async (name, idx) => {
    if (name.trim() === '') return;
    try {
      const res = await axios.get(`http://localhost:5000/api/ingredients/search?q=${name}`);
      setIngredientSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/recipes', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Recipe added!');
      setFormData({ name: '', description: '', ingredients: [{ name: '', quantity: '', unit: 'g' }] });
      const res = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add recipe');
    }
  };

  return (
    <div>
      <h2>Select Recipes</h2>
      {recipes.map(recipe => (
        <div key={recipe._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <h3>{recipe.name.charAt(0).toUpperCase() + recipe.name.slice(1)}</h3>
          <p>{recipe.description}</p>
          <button onClick={() => toggleSelect(recipe._id)}>
            {selectedRecipes.includes(recipe._id) ? 'Remove from List' : 'Add to List'}
          </button>
        </div>
      ))}

      {isAdmin && (
        <div style={{ border: '2px solid green', padding: '1rem', marginTop: '2rem' }}>
          <h3>Add New Recipe</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input name="name" value={formData.name} onChange={handleFormChange} required />
            </div>
            <div>
              <label>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleFormChange} required />
            </div>

            <h4>Ingredients</h4>
            {formData.ingredients.map((ing, idx) => (
              <div key={idx}>
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => handleFormChange(e, idx, 'name')}
                  onBlur={() => handleIngredientSearch(ing.name, idx)}
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={ing.quantity}
                  onChange={(e) => handleFormChange(e, idx, 'quantity')}
                  required
                />
                <select
                  value={ing.unit}
                  onChange={(e) => handleFormChange(e, idx, 'unit')}
                >
                  {['g', 'ml', 'units', 'tbsp', 'tsp', 'cup', 'pinch'].map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            ))}
            <button type="button" onClick={addIngredientField}>Add Ingredient</button>

            <button type="submit" style={{ display: 'block', marginTop: '1rem' }}>Submit Recipe</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Recipes;
