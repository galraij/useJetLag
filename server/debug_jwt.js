require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const token = process.argv[2];

if (!secret) {
  console.error('❌ Error: JWT_SECRET not found in .env');
  process.exit(1);
}

if (!token) {
  console.error('❌ Error: Please provide a token as the first argument.');
  console.log('Usage: node debug_jwt.js <TOKEN>');
  process.exit(1);
}

console.log('--- JWT DEBUG ---');
console.log('Secret (raw):', secret.substring(0, 10) + '...');
console.log('Secret length:', secret.length);

console.log('\n--- ATTEMPT 1: Raw String ---');
try {
  const decoded = jwt.verify(token, secret);
  console.log('✅ Success! Decoded:', JSON.stringify(decoded, null, 2));
} catch (err) {
  console.log('❌ Failed:', err.message);
}

console.log('\n--- ATTEMPT 2: Base64 Buffer ---');
try {
  const decoded = jwt.verify(token, Buffer.from(secret, 'base64'));
  console.log('✅ Success! Decoded:', JSON.stringify(decoded, null, 2));
} catch (err) {
  console.log('❌ Failed:', err.message);
}

console.log('\n--- ATTEMPT 3: Inspect Token (No Verify) ---');
try {
  const decoded = jwt.decode(token);
  console.log('Decoded (unverified):', JSON.stringify(decoded, null, 2));
} catch (err) {
  console.log('❌ Failed to decode:', err.message);
}
