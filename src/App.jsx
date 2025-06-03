import React, { useState , useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import List from './pages/List';
import Login from './pages/Login';
import './App.css'; 

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', ingredients: [{ name: '', quantity: '', unit: 'g' }] });
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
        <NavLink to="/login">Login</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} />} />
        <Route path="/add-recipe" element={
          localStorage.getItem('token') ? 
          <AddRecipe formData={formData} setFormData={setFormData} /> : 
          <Login setIsLoggedIn={setIsLoggedIn} />
        } />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/recipes" element={<Recipes selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} />} />
        <Route path="/list" element={<List selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
