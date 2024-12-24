const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, Node.js server is running!');
});

// Set the HTTP port
const HTTP = process.env.HTTP || 6382; // Default to 3000 if PORT is not set

// Start the server
app.listen(HTTP, () => {
  console.log(`Server is running on http://localhost:${HTTP}`);
});
