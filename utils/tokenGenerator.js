const crypto = require('crypto');
const { getSecretFromDB } = require('./mockDb');

const generateToken = async email => {
  try {
    const secret = await getSecretFromDB();

    return crypto.createHmac('sha256', secret).update(email).digest('base64');
  } catch (error) {
    // THE BUG: Empty catch block.
    // Error is swallowed and undefined is returned.
    console.error('Token generation failed:', error.message);
    throw new Error('Failed to generate token');
  }
};

module.exports = { generateToken };

//* FIX :
//  Fixed empty catch block
//  Previously, Empty catch block that silently swallowed errors and returned undefined
//  Now, Logs the error with console.error() and throws a meaningful error message
//  This provides proper error handling.
