document.addEventListener('DOMContentLoaded', () => {
  const signInForm = document.getElementById('loginForm');
  const signUpForm = document.getElementById('signupForm');
  const signInContainer = document.getElementById('sign-in-form');
  const signUpContainer = document.getElementById('sign-up-form');
  const switchToSignUp = document.getElementById('switchToSignUp');
  const switchToLogin = document.getElementById('switchToLogin');
  const messageContainer = document.getElementById('message-container');
  const messageText = document.getElementById('message-text');

  let messageTimeout;

  // Switch to Sign Up
  switchToSignUp.addEventListener('click', () => {
    signInContainer.classList.add('hidden');
    signInContainer.classList.remove('active');

    setTimeout(() => {
      signUpContainer.classList.remove('hidden');
      signUpContainer.classList.add('active');
    }, 300);
  });

  // Switch to Login
  switchToLogin.addEventListener('click', () => {
    signUpContainer.classList.add('hidden');
    signUpContainer.classList.remove('active');

    setTimeout(() => {
      signInContainer.classList.remove('hidden');
      signInContainer.classList.add('active');
    }, 300);
  });

  function showMessage(message, isError = false) {
    clearTimeout(messageTimeout);

    messageText.textContent = message;
    messageContainer.classList.remove('hidden');

    if (isError) {
      messageContainer.classList.add('error');
    } else {
      messageContainer.classList.remove('error');
    }

    messageTimeout = setTimeout(() => {
      messageContainer.classList.add('hidden');
    }, 3000);
  }

  // Default state
  signInContainer.classList.add('active');

  // Initialize mock database in localStorage if empty
  if (!localStorage.getItem('auth_users')) {
    localStorage.setItem('auth_users', JSON.stringify([]));
  }

  // Handle Sign Up
  signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const users = JSON.parse(localStorage.getItem('auth_users'));

    // Check if user already exists
    const userExists = users.some(u => u.email === email);
    if (userExists) {
      showMessage('Email already registered. Please login.', true);
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('auth_users', JSON.stringify(users));

    showMessage('Registration successful! Please login.');
    signUpForm.reset();

    // Switch back to login
    setTimeout(() => {
      switchToLogin.click();
    }, 1500);
  });

  // Handle Login
  signInForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('auth_users'));

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      showMessage(`Welcome back, ${user.name}! Login successful.`);
      signInForm.reset();
    } else {
      showMessage('Invalid email or password.', true);
    }
  });
});
