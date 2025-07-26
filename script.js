document.addEventListener('DOMContentLoaded', function () {
  // 1. تنظیمات اتصال به Supabase
  const supabaseUrl = 'https://kkxrhnzoqlvgxfwdlubi.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreHJobnpvcWx2Z3hmd2RsdWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzA4MTEsImV4cCI6MjA2OTAwNjgxMX0.5XRv1MGWS-3uXXzNU_sqTW0U14y_YRR121UP7luCin8';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  // 2. انتخاب عناصر DOM
  const elements = {
    modal: document.getElementById('authModal'),
    loginBtn: document.getElementById('loginBtn'),
    signupBtn: document.getElementById('signupBtn'),
    closeBtn: document.getElementById('closeModal'),
    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
    showSignup: document.getElementById('showSignup'),
    showLogin: document.getElementById('showLogin'),
    authError: document.createElement('div')
  };

  // 3. ایجاد دکمه خروج
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'خروج';
  logoutBtn.className = 'logout-btn';
  logoutBtn.style.display = 'none';
  elements.loginBtn.parentNode.appendChild(logoutBtn);

  // 4. تنظیمات اولیه
  elements.authError.id = 'authError';
  elements.authError.style.color = 'red';
  elements.loginForm.prepend(elements.authError);

  // 5. بررسی وضعیت احراز هویت کاربر
  async function checkAuthState() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user) {
      elements.loginBtn.style.display = 'none';
      elements.signupBtn.style.display = 'none';
      logoutBtn.style.display = 'inline';
      console.log('کاربر وارد شده:', user);
    } else {
      console.log('هیچ کاربری وارد نشده');
    }
  }

  // 6. اعتبارسنجی فرم
  function validateForm(email, password) {
    elements.authError.textContent = '';
    
    if (!email || !password) {
      elements.authError.textContent = 'لطفاً تمام فیلدها را پر کنید';
      return false;
    }
    
    if (!email.includes('@')) {
      elements.authError.textContent = 'فرمت ایمیل نامعتبر است';
      return false;
    }
    
    if (password.length < 6) {
      elements.authError.textContent = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
      return false;
    }
    
    return true;
  }

  // 7. مدیریت رویدادها
  function setupEventListeners() {
    // رویدادهای نمایش/پنهان کردن مودال
    elements.loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      elements.loginForm.style.display = 'block';
      elements.signupForm.style.display = 'none';
      elements.modal.style.display = 'flex';
    });

    elements.signupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      elements.loginForm.style.display = 'none';
      elements.signupForm.style.display = 'block';
      elements.modal.style.display = 'flex';
    });

    elements.showSignup.addEventListener('click', (e) => {
      e.preventDefault();
      elements.loginForm.style.display = 'none';
      elements.signupForm.style.display = 'block';
    });

    elements.showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      elements.loginForm.style.display = 'block';
      elements.signupForm.style.display = 'none';
    });

    elements.closeBtn.addEventListener('click', () => {
      elements.modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === elements.modal) {
        elements.modal.style.display = 'none';
      }
    });

    // فرم ورود
    elements.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();

      if (!validateForm(email, password)) return;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        alert('ورود موفقیت‌آمیز بود!');
        elements.modal.style.display = 'none';
        e.target.reset();
        await checkAuthState();
        
      } catch (error) {
        console.error('خطا در ورود:', error);
        elements.authError.textContent = error.message || 'خطا در ورود!';
      }
    });

    // فرم ثبت‌نام
    elements.signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();
      const fullName = e.target.full_name?.value.trim() || email.split('@')[0];

      if (!validateForm(email, password)) return;

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;
        
        alert('ثبت‌نام موفق! لینک تأیید به ایمیل شما ارسال شد.');
        e.target.reset();
        elements.loginForm.style.display = 'block';
        elements.signupForm.style.display = 'none';
        
      } catch (error) {
        console.error('خطا در ثبت‌نام:', error);
        elements.authError.textContent = error.message || 'خطا در ثبت‌نام!';
      }
    });

    // دکمه خروج
    logoutBtn.addEventListener('click', async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('خطا در خروج:', error);
        return;
      }
      localStorage.removeItem('sb_user');
      location.reload();
    });
  }

  // 8. مقداردهی اولیه
  async function init() {
    await checkAuthState();
    setupEventListeners();
    
    // تست اتصال به Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('اتصال به Supabase ناموفق:', error);
    } else {
      console.log('اتصال به Supabase موفق!');
    }
  }

  init();
});