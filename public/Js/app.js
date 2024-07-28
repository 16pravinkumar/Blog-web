let handleEye = () => {
  let passwordInput = document.getElementById('password');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text'; // Show password
  } else {
    passwordInput.type = 'password'; // Hide password
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');

  form.addEventListener('submit', function (event) {
    const name = document.getElementById('name').value.trim();
    const userName = document.getElementById('userName').value.trim();
    const age = document.getElementById('age').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!name) {
      alert('Please enter your name.');
      event.preventDefault();
    } else if (!userName) {
      alert('Please enter a username.');
      event.preventDefault();
    } else if (!age || age < 18) {
      alert('Please enter a valid age (18+).');
      event.preventDefault();
    } else if (!email || !isValidEmail(email)) {
      alert('Please enter a valid email address.');
      event.preventDefault();
    } else if (!password || password.length < 8) {
      alert('Password must be at least 8 characters long.');
      event.preventDefault();
    }
  });

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  window.handleEye = function () {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
});
