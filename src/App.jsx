import { useState , useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import List from './pages/List';
import Login from './pages/Login';
import AddRecipe from './pages/AddRecipe';
import './App.css'; 

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', ingredients: [{ name: '', quantity: '', unit: 'g' }] });

  const [selectedRecipes, setSelectedRecipes] = useState(() => {
    const stored = localStorage.getItem('selectedRecipes');
    return stored ? JSON.parse(stored) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      jwtDecode(token); 
      return true;
    } catch {
      return false;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; 
  };

  useEffect(() => {
    localStorage.setItem('selectedRecipes', JSON.stringify(selectedRecipes));
  }, [selectedRecipes]);

  return (
    <Router>
      <nav className="navbar">
        <div className="hamburger" onClick={() => setShowMenu(!showMenu)}>
          ☰
        </div>
        <div className={`nav-links ${showMenu ? 'show' : ''}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/recipes">Recipes</NavLink>
          <NavLink to="/add-recipe">Add Recipe</NavLink>
          <NavLink to="/list">Supermarket List</NavLink>
          {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
          {isLoggedIn && <a onClick={handleLogout}>Logout</a>}
        </div>
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

        <Route path="*" element={<div><h1>404 Not Found</h1><p>The page you are looking for does not exist.</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;
