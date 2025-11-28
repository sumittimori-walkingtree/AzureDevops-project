require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateVideoContent } = require('./services/gemini');

// Load environment variables


// Initialize Express app
const app = express();
const PORT =  5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API , Sumit' });
});

// API routes

// Video content generation endpoint
app.post('/api/generate-video-content', async (req, res) => {
  const { topic, niche, optionsCount = 3 } = req.body;
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }
  
  try {
    const contentOptions = await generateVideoContent(topic, niche, optionsCount);
    res.json({
      success: true,
      topic,
      niche,
      contentOptions
    });
  } catch (error) {
    console.error('Error in generate-video-content endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate content'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 