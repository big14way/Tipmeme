const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testPaymasterService() {
  console.log('🔧 Testing TipMeme Paymaster Service...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.status);
    
    // Test 2: Status Check
    console.log('\n2. Testing Status Endpoint...');
    const statusResponse = await axios.get(`${BASE_URL}/status`);
    console.log('✅ Service:', statusResponse.data.service);
    console.log('✅ Environment:', statusResponse.data.environment);
    console.log('✅ Starknet Health:', statusResponse.data.starknet?.healthy ? 'Healthy' : 'Unhealthy');
    
    // Test 3: Get Nonce
    console.log('\n3. Testing Nonce Endpoint...');
    const testAddress = '0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb';
    const nonceResponse = await axios.get(`${BASE_URL}/api/sponsor/nonce/${testAddress}`);
    console.log('✅ Nonce for test address:', nonceResponse.data.data.nonce);
    
    // Test 4: Sponsorship Stats
    console.log('\n4. Testing Stats Endpoint...');
    const statsResponse = await axios.get(`${BASE_URL}/stats`);
    console.log('✅ IP Usage:', statsResponse.data.data.ip.usage, 'ETH');
    console.log('✅ IP Remaining:', statsResponse.data.data.ip.remaining, 'ETH');
    console.log('✅ Total Usage:', statsResponse.data.data.total.usage, 'ETH');
    
    // Test 5: Gas Estimation (this will likely fail without real signature)
    console.log('\n5. Testing Gas Estimation...');
    try {
      const estimateResponse = await axios.get(`${BASE_URL}/api/sponsor/estimate`, {
        params: {
          userAddress: testAddress,
          handle: 'test_handle',
          signature: ['0x1234567890abcdef', '0xabcdef1234567890']
        }
      });
      console.log('✅ Gas Estimation:', estimateResponse.data);
    } catch (error) {
      console.log('⚠️  Gas Estimation failed (expected without valid signature):', error.response?.status);
    }
    
    // Test 6: Sponsor Request (this will fail without valid signature)
    console.log('\n6. Testing Sponsor Endpoint...');
    try {
      const sponsorResponse = await axios.post(`${BASE_URL}/api/sponsor`, {
        userAddress: testAddress,
        handle: 'test_handle',
        nonce: '1',
        signature: ['0x1234567890abcdef', '0xabcdef1234567890']
      });
      console.log('✅ Sponsor Response:', sponsorResponse.data);
    } catch (error) {
      console.log('⚠️  Sponsor request failed (expected without valid signature):', error.response?.status);
      if (error.response?.data) {
        console.log('   Error:', error.response.data.error);
        console.log('   Code:', error.response.data.code);
      }
    }
    
    // Test 7: Rate Limiting
    console.log('\n7. Testing Rate Limiting...');
    try {
      const requests = [];
      for (let i = 0; i < 12; i++) { // Exceed rate limit of 10
        requests.push(axios.get(`${BASE_URL}/health`));
      }
      await Promise.all(requests);
      console.log('⚠️  Rate limiting may not be working as expected');
    } catch (error) {
      if (error.response?.status === 429) {
        console.log('✅ Rate limiting is working correctly');
      } else {
        console.log('⚠️  Unexpected error in rate limiting test:', error.response?.status);
      }
    }
    
    console.log('\n🎉 Paymaster Service Test Complete!\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure the paymaster service is running on port 3001');
      console.error('   Run: cd paymaster-service && npm start');
    }
  }
}

// Mock signature generation for testing
function generateMockSignature(userAddress, handle, nonce) {
  // This is just for testing - real implementation would use proper cryptographic signatures
  const mockR = '0x' + '1'.repeat(63) + Math.floor(Math.random() * 16).toString(16);
  const mockS = '0x' + '2'.repeat(63) + Math.floor(Math.random() * 16).toString(16);
  return [mockR, mockS];
}

// Add a more comprehensive test with mock data
async function testWithMockData() {
  console.log('\n🧪 Testing with Mock Data...\n');
  
  const mockData = {
    userAddress: '0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb',
    handle: 'test_user_' + Date.now(),
    nonce: '1',
    signature: generateMockSignature('test', 'handle', '1')
  };
  
  try {
    console.log('Mock data:', JSON.stringify(mockData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/api/sponsor`, mockData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Mock sponsor request succeeded:', response.data);
    
  } catch (error) {
    console.log('⚠️  Mock sponsor request failed (expected):', error.response?.status);
    console.log('   Response:', error.response?.data);
  }
}

// Run tests
if (require.main === module) {
  testPaymasterService().then(() => {
    return testWithMockData();
  }).catch(console.error);
}

module.exports = { testPaymasterService, testWithMockData }; 