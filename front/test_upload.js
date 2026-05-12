const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../back/.env' });

async function run() {
  try {
    const token = jwt.sign({ id: 'test_admin', role: 'admin' }, process.env.JWT_KEY || 'next', { expiresIn: '1h' });
    
    // We will just use standard http instead of form-data package
    // Actually, curl is easier!
    console.log("Token:", token);
  } catch (err) {
    console.log(err);
  }
}
run();
