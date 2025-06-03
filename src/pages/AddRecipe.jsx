import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function AddRecipe({ selectedRecipes, setSelectedRecipes }) {
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
      {isAdmin && (
        <div style={{ border: '2px solid var(--darkred)', padding: '1rem', marginTop: '2rem' }}>
          
          <h3>Add New Recipe</h3>
            <form onSubmit={handleSubmit}>
              <div className='input-container'>
                <div>
                  <label>Name:</label>
                  <input name="name" value={formData.name} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} required />
                </div>
              </div>

            <h4>Ingredients</h4>
            {formData.ingredients.map((ing, idx) => (
              <div className='ingredient-container' key={idx}>
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => {
                    handleFormChange(e, idx, 'name');
                    handleIngredientSearch(e.target.value, idx);
                  }}
                  required
                />
                {ingredientSuggestions.length > 0 && (
                  <ul style={{ background: '#333', color: '#fff', listStyle: 'none', padding: '0.5rem', position: 'absolute', zIndex: 1000 }}>
                    {ingredientSuggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        style={{ padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                        onClick={() => {
                          const updatedIngredients = [...formData.ingredients];
                          updatedIngredients[idx].name = suggestion.name;
                          setFormData({ ...formData, ingredients: updatedIngredients });
                          setIngredientSuggestions([]);
                        }}
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
                <input
                  type="number"
                  placeholder="Quantity"
                  value={ing.quantity}
                  onChange={(e) => handleFormChange(e, idx, 'quantity')}
                  min="0"
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
            <div className="button-container">
              <button type="button" onClick={addIngredientField}>Add Ingredient</button>
              <button type="submit">Submit Recipe</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddRecipe;
