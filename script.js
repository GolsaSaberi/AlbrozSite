document.addEventListener('DOMContentLoaded', function () {
  // Initialize Supabase
  const supabaseUrl = 'https://kkxrhnzoqlvgxfwdlubi.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreHJobnpvcWx2Z3hmd2RsdWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzA4MTEsImV4cCI6MjA2OTAwNjgxMX0.5XRv1MGWS-3uXXzNU_sqTW0U14y_YRR121UP7luCin8';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  // انتخاب عناصر
  const modal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const closeBtn = document.getElementById('closeModal');
  const userProfile = document.getElementById('userProfile');
  const userName = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');

  // بررسی وضعیت ورود کاربر
  async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user) {
      // کاربر وارد شده است
      loginBtn.style.display = 'none';
      signupBtn.style.display = 'none';
      userProfile.style.display = 'inline';
      
      // دریافت اطلاعات کامل کاربر از جدول users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', user.id)
        .single();
      
      if (userData) {
        userName.textContent = userData.full_name || userData.email || 'کاربر';
      } else {
        userName.textContent = user.email || 'کاربر';
      }
    } else {
      // کاربر خارج شده است
      loginBtn.style.display = 'inline';
      signupBtn.style.display = 'inline';
      userProfile.style.display = 'none';
    }
  }

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
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = this.email.value.trim();
    const password = this.password.value.trim();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'در حال ورود...';
    submitBtn.disabled = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // به روز رسانی زمان آخرین ورود
      await supabase
        .from('users')
        .update({ last_login: new Date() })
        .eq('id', data.user.id);

      alert('ورود موفقیت‌آمیز بود!');
      modal.style.display = 'none';
      this.reset();
      await checkAuth();
      
    } catch (error) {
      alert(error.message || 'خطا در ورود. لطفاً ایمیل و رمز عبور را بررسی کنید.');
      console.error('Login error:', error);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // مدیریت فرم ثبت‌نام
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = this.email.value.trim();
    const password = this.password.value.trim();
    const full_name = this.full_name.value.trim();
    const phone = this.phone.value.trim();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'در حال ثبت‌نام...';
    submitBtn.disabled = true;

    try {
      // 1. ثبت‌نام کاربر
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone
          }
        }
      });

      if (authError) throw authError;
      
      // 2. ذخیره اطلاعات در جدول users
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          { 
            id: authData.user.id, 
            email,
            full_name,
            phone,
            role: 'user'
          }
        ]);

      if (dbError) throw dbError;
      
      alert('ثبت‌نام موفقیت‌آمیز بود! اکنون می‌توانید وارد شوید.');
      this.reset();
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      
    } catch (error) {
      alert(error.message || 'خطا در ثبت‌نام. لطفاً اطلاعات را بررسی کنید.');
      console.error('Signup error:', error);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // مدیریت خروج
  logoutBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('خطا در خروج از سیستم: ' + error.message);
    } else {
      await checkAuth();
      alert('با موفقیت خارج شدید.');
    }
  });

  // بررسی وضعیت احراز هویت هنگام بارگذاری صفحه
  checkAuth();

  // بررسی تغییرات وضعیت احراز هویت
  supabase.auth.onAuthStateChange((event, session) => {
    checkAuth();
  });
});