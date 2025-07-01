const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Simple route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from DevOps Pipeline!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
