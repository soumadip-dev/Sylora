# The Silent Server - Authentication Flow Debugging

## Overview

This repository contains my solution for **The Silent Server** debugging assignment. The goal was to fix a broken authentication API that had several bugs preventing users from completing the authentication flow.

## Bugs Identified & Fixed

### 1. `/auth/login` - OTP Logging Format

**Issue:** The server was logging `[OTP]` instead of the actual OTP value, making it impossible to retrieve the OTP for verification.

**Fix:**

```js
// Before
console.log(`[OTP] Session ${loginSessionId} generated`);

// After
console.log(`[${otp}] Session ${loginSessionId} generated`);
```

---

### 2. `/auth/verify-otp` - OTP Data Type Mismatch

**Issue:** The OTP from request body came as a string, but the stored OTP was a number. Strict comparison (`!==`) was failing.

**Fix:**

```js
// Before
if (parseInt(otp) !== otpStore[loginSessionId])

// After
if (Number(otp) !== Number(otpStore[loginSessionId]))
```

---

### 3. `/auth/token` - Wrong Session Source

**Issue:** The endpoint was looking for the session in the `Authorization` header, but the session was stored in a cookie named `session_token`.

**Fix:**

```js
// Before
const token = req.headers.authorization;
const session = loginSessions[token.replace('Bearer ', '')];

// After
const token = req.cookies.session_token;
const session = loginSessions[token];
```

**Also added:** `app.use(cookieParser())` middleware to read cookies.

---

### 4. `middleware/auth.js` - Missing `next()` Call

**Issue:** After verifying the JWT token, the middleware never called `next()`, causing requests to hang indefinitely.

**Fix:**

```js
// Added next() after successful verification
const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
req.user = decoded;
next(); // ← This was missing
```

---

### 5. `middleware/logger.js` - Missing `next()` Call

**Issue:** The request logger middleware wasn't calling `next()`, breaking the entire request pipeline.

**Fix:**

```js
// Added next() at the end of the middleware
res.on('finish', () => { ... });
next();  // ← This was missing
```

---

### 6. `utils/tokenGenerator.js`

**Issue:** The catch block was completely empty. Errors were swallowed and the function returned `undefined` silently.

**Fix:**

```js
catch (error) {
  console.error('Token generation failed:', error.message);
  throw new Error('Failed to generate token');
}
```

---

## Test Output

The complete terminal output showing all 4 test commands and the success flag is available in [`output.txt`](./output.txt).

```
Success Flag: FLAG-c291bWFkaXAubWFqaWxhMDJAZ21haWwuY29tX0NPTVBMRVRFRF9BU1NJR05NRU5U
```

---

**Assignment completed by:** Soumadip Majila  
**Date:** February 2026
