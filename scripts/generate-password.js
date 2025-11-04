#!/usr/bin/env node

/**
 * Generate a bcrypt hash for a password
 * Usage: node scripts/generate-password.js <password>
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Error: Please provide a password as an argument');
  console.log('Usage: node scripts/generate-password.js <password>');
  process.exit(1);
}

// Generate hash with salt rounds = 10
const hash = bcrypt.hashSync(password, 10);

console.log('\n=================================');
console.log('Password Hash Generated');
console.log('=================================\n');
console.log('Add this to your .env file:\n');
console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
console.log('=================================\n');
