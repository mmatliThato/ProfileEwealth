require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cookieParser = require('cookie-parser'); // Import cookie-parser for handling cookies
const apiRoutes = require('./routes/api'); // Ensure the routes module is correctly referenced

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Routes for the API
app.use('/api', apiRoutes);

// Default route for unmatched endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});