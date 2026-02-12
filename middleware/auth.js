const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

//* FIX :
// Added missing next() call
// Previously, the function didn't call next() after successful verification
// Now, calls next() to pass control to the next middleware/route handler
// This ensures the request flow continues after JWT verification.
