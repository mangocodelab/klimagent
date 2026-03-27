const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    // This will be handled in the main server file
    res.json({ 
      response: 'This is a sample response from the AI assistant',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;