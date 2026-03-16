const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const requestLogger = require('./middleware/logger');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Session storage
const loginSessions = {};
const otpStore = {};
const rateLimitStore = {};

app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    challenge: 'Complete Authentication Flow',
  });
});

// LOGIN
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password required',
    });
  }

  // Rate limit (5 attempts per minute)
  if (!rateLimitStore[email]) {
    rateLimitStore[email] = {
      count: 0,
      time: Date.now(),
    };
  }

  if (Date.now() - rateLimitStore[email].time < 60000) {
    if (rateLimitStore[email].count > 5) {
      return res.status(429).json({
        error: 'Too many attempts',
      });
    }
    rateLimitStore[email].count++;
  } else {
    rateLimitStore[email] = {
      count: 1,
      time: Date.now(),
    };
  }

  const loginSessionId = Math.random().toString(36).substring(2, 10);

  const otp = Math.floor(100000 + Math.random() * 900000);

  loginSessions[loginSessionId] = {
    email,
    expiresAt: Date.now() + 2 * 60 * 1000,
  };

  otpStore[loginSessionId] = otp;

  console.log('OTP:', otp);

  res.json({
    message: 'OTP sent',
    loginSessionId,
  });
});

// RESEND OTP
app.post('/auth/resend-otp', (req, res) => {
  const { loginSessionId } = req.body;

  const session = loginSessions[loginSessionId];

  if (!session) {
    return res.status(401).json({
      error: 'Invalid session',
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[loginSessionId] = otp;

  session.expiresAt = Date.now() + 2 * 60 * 1000;

  console.log('New OTP:', otp);

  res.json({
    message: 'OTP resent',
  });
});

// VERIFY OTP
app.post('/auth/verify-otp', (req, res) => {
  const { loginSessionId, otp } = req.body;

  if (!loginSessionId || !otp) {
    return res.status(400).json({
      error: 'Missing fields',
    });
  }

  const session = loginSessions[loginSessionId];

  if (!session) {
    return res.status(401).json({
      error: 'Invalid session',
    });
  }

  if (Date.now() > session.expiresAt) {
    return res.status(401).json({
      error: 'Expired',
    });
  }

  if (Number(otp) !== Number(otpStore[loginSessionId])) {
    return res.status(401).json({
      error: 'Wrong OTP',
    });
  }

  res.cookie('session_token', loginSessionId, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  delete otpStore[loginSessionId];

  res.json({
    message: 'Verified',
  });
});

// TOKEN
app.post('/auth/token', (req, res) => {
  const token = req.cookies.session_token;

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  const session = loginSessions[token];

  if (!session) {
    return res.status(401).json({
      error: 'Invalid',
    });
  }

  const secret = process.env.JWT_SECRET || 'default-secret-key';

  const accessToken = jwt.sign(
    {
      email: session.email,
    },
    secret,
    {
      expiresIn: '15m',
    }
  );

  res.json({
    access_token: accessToken,
  });
});

// PROTECTED
app.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Access granted',

    success_flag: 'FLAG-' + Buffer.from(req.user.email + '_COMPLETED').toString('base64'),
  });
});

// LOGOUT
app.post('/auth/logout', (req, res) => {
  const token = req.cookies.session_token;

  delete loginSessions[token];

  res.clearCookie('session_token');

  res.json({
    message: 'Logged out',
  });
});

// CLEANUP
setInterval(() => {
  const now = Date.now();

  Object.keys(loginSessions).forEach(id => {
    if (loginSessions[id].expiresAt < now) {
      delete loginSessions[id];
      delete otpStore[id];
    }
  });
}, 60000);

app.listen(PORT, () => {
  console.log(`Server running ${PORT}`);
});
