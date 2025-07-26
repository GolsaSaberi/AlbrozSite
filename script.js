document.addEventListener('DOMContentLoaded', function () {
  // اتصال به Supabase
  const supabaseUrl = 'https://kkxrhnzoqlvgxfwdlubi.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreHJobnpvcWx2Z3hmd2RsdWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzA4MTEsImV4cCI6MjA2OTAwNjgxMX0.5XRv1MGWS-3uXXzNU_sqTW0U14y_YRR121UP7luCin8';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  // انتخاب عناصر
  const modal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const closeBtn = document.getElementById('closeModal');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');

  // رویدادهای کلیک (همان بخش قبلی بدون تغییر)
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

  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // مدیریت فرم ورود (با Supabase)
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = this.username.value.trim(); // تغییر از username به email
    const password = this.password.value.trim();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      alert('ورود موفقیت‌آمیز بود!');
      modal.style.display = 'none';
      this.reset();
      
      // ذخیره وضعیت کاربر
      localStorage.setItem('sb_user', JSON.stringify(data.user));
      
    } catch (error) {
      console.error('خطا در ورود:', error);
      alert(error.message || 'خطا در ورود!');
    }
  });

  // مدیریت فرم ثبت‌نام (با Supabase)
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = this.username.value.trim(); // تغییر از username به email
    const password = this.password.value.trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0] // نام کاربری از بخش قبل از @ ایمیل
          }
        }
      });

      if (error) throw error;
      
      alert('ثبت‌نام موفق! لینک تأیید به ایمیل شما ارسال شد.');
      this.reset();
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      
    } catch (error) {
      console.error('خطا در ثبت‌نام:', error);
      alert(error.message || 'خطا در ثبت‌نام!');
    }
  });
});