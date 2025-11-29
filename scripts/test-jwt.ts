#!/usr/bin/env node

// Script to test JWT token generation and verification
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

console.log('\n🔐 JWT Environment Check\n');
console.log('ACCESS_TOKEN_SECRET:', ACCESS_TOKEN_SECRET ? '✅ Set' : '❌ Not Set');
console.log('REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET ? '✅ Set' : '❌ Not Set');

if (!ACCESS_TOKEN_SECRET) {
  console.log('\n⚠️  WARNING: ACCESS_TOKEN_SECRET is not set!');
  console.log('Please add it to your .env file:');
  console.log('ACCESS_TOKEN_SECRET=your_secret_key_here');
  process.exit(1);
}

// Test token generation and verification
const testPayload = { id: 1, email: 'test@example.com' };

console.log('\n📝 Testing Token Generation...\n');
const token = jwt.sign(testPayload, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
console.log('Generated Token (first 50 chars):', token.substring(0, 50) + '...');

console.log('\n✅ Testing Token Verification...\n');
try {
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  console.log('Decoded Payload:', decoded);
  console.log('\n✅ JWT is working correctly!');
} catch (error) {
  console.error('❌ JWT verification failed:', error);
}

console.log('\n💡 To use in your app, set this cookie:');
console.log('accessToken=' + token);
