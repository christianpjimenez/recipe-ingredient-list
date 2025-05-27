import { useEffect, useState } from 'react';
import axios from 'axios';

function List({ selectedRecipes, setSelectedRecipes }) {
  const [ingredients, setIngredients] = useState([]);
  const [checked, setChecked] = useState(() => {
  try {
    const stored = localStorage.getItem('checked');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
});

  useEffect(() => {
    localStorage.setItem('checked', JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    if (selectedRecipes.length === 0) return;

    axios.post('http://localhost:5000/api/list/generate', {
      recipeIds: selectedRecipes
    })
      .then(res => setIngredients(res.data))
      .catch(err => console.error(err));
  }, [selectedRecipes]);

  function resetList() {
  setChecked({});
  setIngredients([]);
  setSelectedRecipes([]); 
  localStorage.removeItem('selectedRecipes');
  localStorage.removeItem('checkedItems');
  }

  return (
    <div>
      <h2>Supermarket List</h2>
      {ingredients.length === 0 && <p>No recipes selected.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {ingredients.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={checked[item.id] || false}
                onChange={() =>
                  setChecked(prev => ({
                    ...prev,
                    [item.id]: !prev[item.id]
                  }))
                }
              />
              <span style={{ textDecoration: checked[item.id] ? 'line-through' : 'none' }}>
                {item.total} {item.unit} {item.name}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button onClick={resetList} style={{ marginTop: '1rem' }}>
        Reset List
      </button>
    </div>
  );
}

export default List;