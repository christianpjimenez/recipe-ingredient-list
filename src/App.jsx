import React, { useState , useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import List from './pages/List';
import './App.css'; 

function App() {
  const [selectedRecipes, setSelectedRecipes] = useState(() => {
    const stored = localStorage.getItem('selectedRecipes');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('selectedRecipes', JSON.stringify(selectedRecipes));
  }, [selectedRecipes]);

  return (
    <Router>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/list">Supermarket List</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} />} />
        <Route path="/list" element={<List selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} />} />
      </Routes>
    </Router>
  );
}

export default App;
