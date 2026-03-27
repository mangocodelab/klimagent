const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// NVIDIA NIM API integration
const configuration = new Configuration({
  apiKey: process.env.NIM_API_KEY,
  basePath: "https://integrate.api.nvidia.com/v1"
});

const openai = new OpenAIApi(configuration);

// Handle chat messages
io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('chat message', async (data) => {
    try {
      // Send user message back
      socket.emit('chat response', { content: `<strong>You:</strong> ${data.message}` });
      
      // Get response from NVIDIA NIM API
      const response = await openai.createChatCompletion({
        model: "nv-llama2-70b",
        messages: [{
          role: "user",
          content: data.message
        }],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0.5,
        presence_penalty: 0.5
      });
      
      // Send AI response back to client
      socket.emit('chat response', { 
        content: `<strong>AI Assistant:</strong> ${response.data.choices[0].message.content}`,
        role: "assistant"
      });
    } catch (error) {
      console.error('Error:', error);
      socket.emit('chat response', { 
        content: "Sorry, I encountered an error processing your request.",
        role: "assistant",
        error: true
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});