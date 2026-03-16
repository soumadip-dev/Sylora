const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const requestLogger = require('./middleware/logger');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Session storage (in-memory)
const loginSessions = {};
const otpStore = {};

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    challenge: 'Complete the Authentication Flow',
    instruction: 'Complete the authentication flow and obtain a valid access token',
  });
});

// LOGIN
app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required',
      });
    }

    const loginSessionId = Math.random().toString(36).substring(2, 10);

    const otp = Math.floor(100000 + Math.random() * 900000);

    loginSessions[loginSessionId] = {
      email,
      password,
      createdAt: Date.now(),
      expiresAt: Date.now() + 2 * 60 * 1000,
    };

    otpStore[loginSessionId] = otp;

    console.log(`OTP ${otp} for session ${loginSessionId}`);

    return res.status(200).json({
      message: 'OTP sent',
      loginSessionId,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
    });
  }
});

// VERIFY OTP
app.post('/auth/verify-otp', (req, res) => {
  try {
    const { loginSessionId, otp } = req.body;

    if (!loginSessionId || !otp) {
      return res.status(400).json({
        error: 'loginSessionId and otp required',
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
        error: 'Session expired',
      });
    }

    if (Number(otp) !== Number(otpStore[loginSessionId])) {
      return res.status(401).json({
        error: 'Invalid OTP',
      });
    }

    res.cookie('session_token', loginSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    delete otpStore[loginSessionId];

    return res.status(200).json({
      message: 'OTP verified',
      sessionId: loginSessionId,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'OTP verification failed',
    });
  }
});

// GENERATE JWT TOKEN
app.post('/auth/token', (req, res) => {
  try {
    const token = req.cookies.session_token;

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized - valid session required',
      });
    }

    const session = loginSessions[token];

    if (!session) {
      return res.status(401).json({
        error: 'Invalid session',
      });
    }

    const secret = process.env.JWT_SECRET || 'default-secret-key';

    const accessToken = jwt.sign(
      {
        email: session.email,
        sessionId: token,
      },
      secret,
      {
        expiresIn: '15m',
      }
    );

    return res.status(200).json({
      access_token: accessToken,
      expires_in: 900,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Token generation failed',
    });
  }
});

// REFRESH TOKEN
app.post('/auth/refresh', (req, res) => {
  try {
    const token = req.cookies.session_token;

    if (!token) {
      return res.status(401).json({
        error: 'No session found',
      });
    }

    const session = loginSessions[token];

    if (!session) {
      return res.status(401).json({
        error: 'Invalid session',
      });
    }

    const secret = process.env.JWT_SECRET || 'default-secret-key';

    const newAccessToken = jwt.sign(
      {
        email: session.email,
        sessionId: token,
      },
      secret,
      {
        expiresIn: '15m',
      }
    );

    return res.json({
      access_token: newAccessToken,
      expires_in: 900,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Refresh failed',
    });
  }
});

// PROTECTED ROUTE
app.get('/protected', authMiddleware, (req, res) => {
  return res.json({
    message: 'Access granted',
    user: req.user,
    success_flag: `FLAG-${Buffer.from(req.user.email + '_COMPLETED_ASSIGNMENT').toString(
      'base64'
    )}`,
  });
});

// LOGOUT
app.post('/auth/logout', (req, res) => {
  try {
    const token = req.cookies.session_token;

    if (!token) {
      return res.status(400).json({
        error: 'No active session',
      });
    }

    if (loginSessions[token]) {
      delete loginSessions[token];
    }

    res.clearCookie('session_token');

    return res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Logout failed',
    });
  }
});

// CLEAN EXPIRED SESSIONS
setInterval(() => {
  const now = Date.now();

  Object.keys(loginSessions).forEach(sessionId => {
    if (loginSessions[sessionId].expiresAt < now) {
      delete loginSessions[sessionId];
      delete otpStore[sessionId];
    }
  });
}, 60000);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
