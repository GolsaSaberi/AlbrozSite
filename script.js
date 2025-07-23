document.addEventListener('DOMContentLoaded', function () {
  // انتخاب عناصر
  const modal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const closeBtn = document.getElementById('closeModal');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');

  // بارگیری کاربران از localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];

  // رویدادهای کلیک
  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    modal.style.display = 'flex';
  });

  signupBtn.addEventListener('click', function (e) {
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

  // بستن مودال
  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // مدیریت فرم ورود
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.username.value.trim();
    const password = this.password.value.trim();

    if (users.length === 0) {
      alert('هیچ کاربری ثبت‌نام نکرده است!');
      return;
    }

    const user = users.find(u => u.username === username);
    
    if (!user) {
      alert('کاربری با این نام کاربری وجود ندارد!');
    } else if (user.password !== password) {
      alert('رمز عبور اشتباه است!');
    } else {
      alert('ورود موفقیت‌آمیز بود!');
      modal.style.display = 'none';
      this.reset();
    }
  });

  // مدیریت فرم ثبت‌نام
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.username.value.trim();
    const password = this.password.value.trim();

    if (!username || !password) {
      alert('لطفاً تمام فیلدها را پر کنید!');
      return;
    }

    if (users.some(u => u.username === username)) {
      alert('این نام کاربری قبلاً ثبت شده است!');
    } else {
      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('ثبت‌نام با موفقیت انجام شد!');
      this.reset();
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    }
  });
});