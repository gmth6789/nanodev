const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('public'));

// Serve registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/register.html'));
});

// Serve user dashboard
app.get('/dashboard/:uid', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
