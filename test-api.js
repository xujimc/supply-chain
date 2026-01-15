// Quick test script to check Backboard API
import axios from 'axios';

const API_KEY = 'espr_lXOcLqKkZC7CuseG8dhQQkm9ujFCsxLXgC1TipRj37I';
const BASE_URL = 'https://app.backboard.io/api';

async function testAPI() {
  console.log('Testing Backboard API...\n');

  // Try to create an assistant
  try {
    console.log('1. Attempting to create assistant...');
    const response = await axios.post(`${BASE_URL}/assistants`, {
      name: 'Test Assistant',
      llm_provider: 'openai',
      llm_model_name: 'gpt-4o',
      tools: []
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✓ Success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('✗ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // Try alternate authentication method
  try {
    console.log('\n2. Trying alternate auth header (x-api-key)...');
    const response = await axios.post(`${BASE_URL}/assistants`, {
      name: 'Test Assistant',
      llm_provider: 'openai',
      llm_model_name: 'gpt-4o',
      tools: []
    }, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✓ Success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('✗ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // Try v1 endpoint path
  try {
    console.log('\n3. Trying /v1/assistants endpoint...');
    const response = await axios.post(`${BASE_URL}/v1/assistants`, {
      name: 'Test Assistant',
      model: 'gpt-4o',
      instructions: 'You are a helpful assistant.'
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✓ Success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('✗ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAPI();
