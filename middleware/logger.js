const requestLogger = (req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
};

module.exports = requestLogger;

//* FIX :
// Added missing next() call
// Previously, The middleware didn't call next() to continue the request flow
// Now, Calls next() after setting up the logger
// This prevents the request from hanging indefinitely.
