// Test different authentication methods
import axios from 'axios';

const API_KEY = 'espr_qM-63odsIsSGHzzXuv31KZoNLhAzoldp8vSeUl4mq4U';
const BASE_URL = 'https://app.backboard.io/api';

async function testAuth() {
  console.log('Testing different auth methods...\n');

  // Method 1: API-Key header (exact case)
  try {
    console.log('1. Trying API-Key header...');
    const response = await axios.post(`${BASE_URL}/assistants`, {
      name: 'Test',
      llm_provider: 'openai',
      llm_model_name: 'gpt-4o'
    }, {
      headers: {
        'API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log('✓ Success!', response.data);
  } catch (error) {
    console.log('✗ Failed:', error.response?.status, error.response?.data);
  }

  // Method 2: Query parameter
  try {
    console.log('\n2. Trying query parameter...');
    const response = await axios.post(`${BASE_URL}/assistants?api_key=${API_KEY}`, {
      name: 'Test',
      llm_provider: 'openai',
      llm_model_name: 'gpt-4o'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✓ Success!', response.data);
  } catch (error) {
    console.log('✗ Failed:', error.response?.status, error.response?.data);
  }

  // Method 3: Check what endpoints exist
  try {
    console.log('\n3. Trying GET /api (root endpoint)...');
    const response = await axios.get(`${BASE_URL}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    console.log('✓ Success!', response.data);
  } catch (error) {
    console.log('✗ Failed:', error.response?.status, error.response?.data);
  }

  // Method 4: Check /v1/chat/completions (OpenAI-compatible)
  try {
    console.log('\n4. Trying OpenAI-compatible endpoint...');
    const response = await axios.post(`${BASE_URL}/v1/chat/completions`, {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'test' }]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✓ Success!', response.data);
  } catch (error) {
    console.log('✗ Failed:', error.response?.status, error.response?.data);
  }

  // Method 5: List available endpoints
  console.log('\n5. Checking if docs endpoint exists...');
  try {
    const response = await axios.get(`https://app.backboard.io/docs`);
    console.log('Docs available');
  } catch (error) {
    console.log('No docs at /docs');
  }
}

testAuth();
