import { useEffect, useState } from 'react';
import axios from 'axios';

function Recipes({ selectedRecipes, setSelectedRecipes }) {
  const [recipes, setRecipes] = useState([]);

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


  return (
    <div>
      <h2>Select Recipes</h2>
      {recipes.map(recipe => (
        <div key={recipe._id} style={{ border: '1px solid var(--red)', padding: '1rem', margin: '1rem 0' }}>
          <h3>{recipe.name.charAt(0).toUpperCase() + recipe.name.slice(1)}</h3>
          <p>{recipe.description}</p>
          <button onClick={() => toggleSelect(recipe._id)}>
            {selectedRecipes.includes(recipe._id) ? 'Remove from List' : 'Add to List'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Recipes;
