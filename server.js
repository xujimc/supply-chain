import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Backboard API configuration
const BACKBOARD_API_BASE = 'https://app.backboard.io/api';
const API_KEY = process.env.VITE_BACKBOARD_API_KEY;

const backboardAPI = axios.create({
  baseURL: BACKBOARD_API_BASE,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 60000
});

// Create assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log('Creating assistant:', { name, description });

    const response = await backboardAPI.post('/assistants', {
      name,
      description
    });

    console.log('✓ Assistant created:', response.data.assistant_id);
    res.json({ assistantId: response.data.assistant_id });
  } catch (error) {
    console.error('✗ Create assistant error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.detail || error.message });
  }
});

// Create thread
app.post('/api/thread', async (req, res) => {
  try {
    const { assistantId } = req.body;
    console.log('Creating thread for assistant:', assistantId);

    const response = await backboardAPI.post(`/assistants/${assistantId}/threads`, {});

    console.log('✓ Thread created:', response.data.thread_id);
    res.json({ threadId: response.data.thread_id });
  } catch (error) {
    console.error('✗ Create thread error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.detail || error.message });
  }
});

// Send message and get AI analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { threadId, content } = req.body;
    console.log('Sending message to thread:', threadId);

    // Use URLSearchParams for form data
    const formData = new URLSearchParams();
    formData.append('content', content);
    formData.append('stream', 'false');
    formData.append('memory', 'Auto');

    const response = await axios.post(
      `${BACKBOARD_API_BASE}/threads/${threadId}/messages`,
      formData,
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 60000
      }
    );

    console.log('✓ AI response received');
    res.json({ content: response.data.content });
  } catch (error) {
    console.error('✗ Analyze error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.detail || error.message });
  }
});

// Handle unhandled errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Connected to Backboard API`);
  console.log(`🔑 API Key loaded: ${API_KEY ? API_KEY.substring(0, 15) + '...' : 'NOT FOUND'}`);
});

// Keep server alive
server.on('error', (error) => {
  console.error('Server error:', error);
});
