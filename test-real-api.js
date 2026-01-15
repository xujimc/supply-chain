// Test with the real API structure
import axios from 'axios';

const API_KEY = 'espr_qM-63odsIsSGHzzXuv31KZoNLhAzoldp8vSeUl4mq4U';
const BASE_URL = 'https://app.backboard.io/api';

async function testRealAPI() {
  console.log('Testing Backboard API with correct structure...\n');

  // Test 1: Create assistant
  try {
    console.log('1. Creating assistant...');
    const response = await axios.post(`${BASE_URL}/assistants`, {
      name: 'Test Assistant',
      system_prompt: 'You are a helpful assistant.'
    }, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✓ Assistant created!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

    const assistantId = response.data.assistant_id;

    // Test 2: Create thread
    console.log('\n2. Creating thread...');
    const threadResponse = await axios.post(
      `${BASE_URL}/assistants/${assistantId}/threads`,
      {},
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✓ Thread created!');
    console.log('Response:', JSON.stringify(threadResponse.data, null, 2));

    const threadId = threadResponse.data.thread_id;

    // Test 3: Send message
    console.log('\n3. Sending test message...');
    const formData = new URLSearchParams();
    formData.append('content', 'Say hello in one sentence.');
    formData.append('stream', 'false');
    formData.append('memory', 'Auto');

    const messageResponse = await axios.post(
      `${BASE_URL}/threads/${threadId}/messages`,
      formData,
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✓ Message sent and received!');
    console.log('Response:', JSON.stringify(messageResponse.data, null, 2));

  } catch (error) {
    console.log('\n✗ ERROR:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received. Network error?');
    }
  }
}

testRealAPI();
