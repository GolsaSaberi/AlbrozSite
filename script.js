document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('authModal');
  const loginLink = document.querySelector('.login-box a:nth-child(1)');
  const signupLink = document.querySelector('.login-box a:nth-child(3)');
  const closeBtn = document.querySelector('.close-btn');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');

  let users = JSON.parse(localStorage.getItem('users')) || [];

  // نمایش فرم ورود
  loginLink.addEventListener('click', function (e) {
    e.preventDefault();
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    modal.style.display = 'flex';
  });

  // نمایش فرم ثبت‌نام
  signupLink.addEventListener('click', function (e) {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    modal.style.display = 'flex';
  });

  // سوئیچ از ورود به ثبت‌نام
  showSignup.addEventListener('click', function (e) {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  });

  // سوئیچ از ثبت‌نام به ورود
  showLogin.addEventListener('click', function (e) {
    e.preventDefault();
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  });

  // بستن مودال
  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  // بستن مودال با کلیک بیرون از فرم
  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // فرم ورود
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      alert('ورود موفقیت‌آمیز بود!');
      modal.style.display = 'none';
    } else {
      alert('نام کاربری یا رمز عبور اشتباه است!');
    }
  });

  // فرم ثبت‌نام
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = signupForm.username.value.trim();
    const password = signupForm.password.value.trim();

    const exists = users.some((u) => u.username === username);
    if (exists) {
      alert('این نام کاربری قبلاً ثبت شده است.');
    } else {
      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('ثبت‌نام با موفقیت انجام شد.');
      signupForm.reset();
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    }
  });
});
