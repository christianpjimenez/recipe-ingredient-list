import { useEffect, useState } from 'react';
import axios from 'axios';

function List({ selectedRecipes }) {
  const [ingredients, setIngredients] = useState([]);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (selectedRecipes.length === 0) return;

    axios.post('http://localhost:5000/api/list/generate', {
      recipeIds: selectedRecipes
    })
      .then(res => setIngredients(res.data))
      .catch(err => console.error(err));
  }, [selectedRecipes]);

  const toggleCheck = (id) => {
    setChecked(prev =>
      prev.includes(id)
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      <h2>Supermarket List</h2>
      {ingredients.length === 0 && <p>No recipes selected.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {ingredients.map(item => (
          <li key={item.id} style={{ marginBottom: '1rem' }}>
            <label style={{ textDecoration: checked.includes(item.id) ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={checked.includes(item.id)}
                onChange={() => toggleCheck(item.id)}
              />
              {' '}
              {item.total} {item.unit} {item.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;