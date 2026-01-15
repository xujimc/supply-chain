import express from 'express';
import cors from 'cors';
import { BackboardClient } from 'backboard-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Backboard client
const backboard = new BackboardClient({
  apiKey: process.env.VITE_BACKBOARD_API_KEY
});

// Create assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { name, description } = req.body;
    const assistant = await backboard.createAssistant({
      name,
      description
    });
    res.json({ assistantId: assistant.assistantId });
  } catch (error) {
    console.error('Create assistant error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create thread
app.post('/api/thread', async (req, res) => {
  try {
    const { assistantId } = req.body;
    const thread = await backboard.createThread(assistantId);
    res.json({ threadId: thread.threadId });
  } catch (error) {
    console.error('Create thread error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send message and get AI analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { threadId, content, retryCount } = req.body;

    const response = await backboard.addMessage(threadId, {
      content,
      llm_provider: 'openai',
      model_name: 'gpt-4o',
      stream: false
    });

    res.json({ content: response.content });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
