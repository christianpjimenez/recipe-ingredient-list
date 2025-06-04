import { useEffect, useState , useRef } from 'react';
import axios from 'axios';

function List({ selectedRecipes, setSelectedRecipes }) {
  const listRef = useRef();
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

    axios.post('/api/list/generate', {
      recipeIds: selectedRecipes
    })
      .then(res => setIngredients(res.data))
      .catch(err => console.error(err));
  }, [selectedRecipes]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
  const text = ingredients
    .map((item) => `- ${item.name}: ${item.total} ${item.unit}`)
    .join('\n');

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'supermarket-list.txt';
  link.click();
};


  function resetList() {
  setChecked({});
  setIngredients([]);
  setSelectedRecipes([]); 
  localStorage.removeItem('selectedRecipes');
  localStorage.removeItem('checkedItems');
  }

  return (
    <div ref={listRef}>
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
      <br />
      <div>
        <div className='button-container'>
            <button onClick={resetList}>🔄 Reset List</button>
          
            <button onClick={handlePrint}>🖨️ Print List</button>
          
            <button onClick={handleExport}>📄 Export as TXT</button>
        </div>
      </div>
    </div>
  );
}

export default List;