const modal = document.getElementById('authModal');
const loginLink = document.querySelector('.login-box a:nth-child(1)');
const signupLink = document.querySelector('.login-box a:nth-child(3)');
const closeBtn = document.querySelector('.close-btn');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

loginLink.addEventListener('click', function (e) {
  e.preventDefault();
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  modal.style.display = 'flex';
});

signupLink.addEventListener('click', function (e) {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  modal.style.display = 'flex';
});

showSignup.addEventListener('click', function (e) {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});

showLogin.addEventListener('click', function (e) {
  e.preventDefault();
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
});

closeBtn.addEventListener('click', function () {
  modal.style.display = 'none';
});

window.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
