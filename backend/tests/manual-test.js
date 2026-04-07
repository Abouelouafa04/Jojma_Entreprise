#!/usr/bin/env node

/**
 * Test script for JOJMA Auth API
 * Run with: node tests/manual-test.js
 */

const http = require('http');

const API_BASE = 'http://localhost:3000/api';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAuthAPI() {
  console.log('🧪 Testing JOJMA Auth API...\n');

  try {
    // Test 1: Register
    console.log('1. Testing user registration...');
    const registerData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      accountType: 'creator',
      agreeToTerms: true
    };

    const registerResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, registerData);

    console.log(`   Status: ${registerResponse.status}`);
    if (registerResponse.status === 201) {
      console.log('   ✅ Registration successful');
      console.log(`   Message: ${registerResponse.data.message}`);
    } else {
      console.log('   ❌ Registration failed');
      console.log(`   Error: ${JSON.stringify(registerResponse.data, null, 2)}`);
    }

    // Test 2: Login
    console.log('\n2. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true
    };

    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, loginData);

    console.log(`   Status: ${loginResponse.status}`);
    if (loginResponse.status === 200) {
      console.log('   ✅ Login successful');
      console.log(`   Token received: ${loginResponse.data.token ? 'Yes' : 'No'}`);
    } else {
      console.log('   ❌ Login failed');
      console.log(`   Error: ${JSON.stringify(loginResponse.data, null, 2)}`);
    }

    // Test 3: Invalid login
    console.log('\n3. Testing invalid login...');
    const invalidLoginData = {
      email: 'wrong@example.com',
      password: 'wrongpassword'
    };

    const invalidLoginResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, invalidLoginData);

    console.log(`   Status: ${invalidLoginResponse.status}`);
    if (invalidLoginResponse.status === 401) {
      console.log('   ✅ Invalid login correctly rejected');
      console.log(`   Message: ${invalidLoginResponse.data.message}`);
    } else {
      console.log('   ❌ Invalid login not properly rejected');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🎯 Auth API tests completed!');
}

// Run tests
testAuthAPI();