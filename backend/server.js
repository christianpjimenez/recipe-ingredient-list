const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); 
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

// API routes
console.log('Mounting authRoutes');
app.use('/api/auth', authRoutes);
console.log('Mounting recipeRoutes');
app.use('/api/recipes', recipeRoutes);
console.log('Mounting ingredientRoutes');    
app.use('/api/ingredients', ingredientRoutes);
console.log('Mounting listRoutes');
app.use('/api/list', listRoutes);
console.log('All routes mounted successfully');

console.log('Serving static files from:', path.join(__dirname, '../dist'));
/*app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist', 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});*/

console.log('Express app initialized and static files served, fetching database and port from environment variables');
// DB connection + start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log('DB connection error:', err));
