// Utsavia Scripts - Modular, Accessible, and Responsive

// Responsive Navigation Menu
(function() {
  const navToggle = document.querySelector('.nav__toggle');
  const navList = document.querySelector('.nav__list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navList.classList.toggle('active');
    });
    // Close menu on link click (mobile)
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

// Smooth Scrolling for Anchor Links
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// Button Micro-Interactions
(function() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => btn.classList.add('active'));
    btn.addEventListener('mouseup', () => btn.classList.remove('active'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('active'));
    btn.addEventListener('touchstart', () => btn.classList.add('active'));
    btn.addEventListener('touchend', () => btn.classList.remove('active'));
  });
})();

// Simple Form Validation (for demo forms)
(function() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('input--error');
          valid = false;
        } else {
          input.classList.remove('input--error');
        }
      });
      if (!valid) {
        e.preventDefault();
      }
    });
  });
})();

// Lazy Loading Polyfill (for older browsers)
(function() {
  if ('loading' in HTMLImageElement.prototype) return;
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (!img.src) {
      img.src = img.dataset.src;
    }
  });
})();

// Loading Animation (for future use)
(function() {
  // Placeholder for loading spinner logic if needed
})();

// Auth Show/Hide Password & Validation
(function() {
  // Show/hide password toggles
  document.querySelectorAll('.auth-show-password').forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          this.textContent = 'Hide';
        } else {
          input.type = 'password';
          this.textContent = 'Show';
        }
      }
    });
  });

  // Frontend-only Auth Logic (localStorage/sessionStorage)
  (function() {
    // Utility: Get users from localStorage
    function getUsers() {
      return JSON.parse(localStorage.getItem('utsaviaUsers') || '[]');
    }
    // Utility: Save users to localStorage
    function saveUsers(users) {
      localStorage.setItem('utsaviaUsers', JSON.stringify(users));
    }
    // Utility: Save session
    function saveSession(user) {
      sessionStorage.setItem('utsaviaUser', JSON.stringify(user));
    }
    // Utility: Clear session
    function clearSession() {
      sessionStorage.removeItem('utsaviaUser');
    }

    // Register form logic
    const registerForm = document.querySelector('.auth-form[aria-label="Register Form"]');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const role = registerForm.querySelector('#register-role').value;
        const name = registerForm.querySelector('#register-name').value.trim();
        const email = registerForm.querySelector('#register-email').value.trim().toLowerCase();
        const password = registerForm.querySelector('#register-password').value;
        const confirm = registerForm.querySelector('#register-confirm-password').value;
        const error = registerForm.querySelector('.auth-error');
        let valid = true;
        if (!role || !name || !email || !password || !confirm) valid = false;
        if (password !== confirm) {
          valid = false;
          error.textContent = 'Passwords do not match.';
        }
        let users = getUsers();
        if (users.find(u => u.email === email && u.role === role)) {
          valid = false;
          error.textContent = 'User already exists for this profile.';
        }
        if (!valid) {
          error.style.display = 'block';
          return;
        }
        users.push({ role, name, email, password });
        saveUsers(users);
        error.style.display = 'none';
        // Auto-login after registration
        saveSession({ role, name, email });
        window.location.href = 'dashboard.html';
      });
    }

    // Login form logic
    const loginForm = document.querySelector('.auth-form[aria-label="Login Form"]');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const role = loginForm.querySelector('#login-role').value;
        const email = loginForm.querySelector('#login-email').value.trim().toLowerCase();
        const password = loginForm.querySelector('#login-password').value;
        const error = loginForm.querySelector('.auth-error');
        let valid = true;
        if (!role || !email || !password) valid = false;
        let users = getUsers();
        const user = users.find(u => u.email === email && u.role === role && u.password === password);
        if (!user) {
          valid = false;
          error.textContent = 'Invalid credentials. Please try again.';
        }
        if (!valid) {
          error.style.display = 'block';
          return;
        }
        error.style.display = 'none';
        saveSession({ role: user.role, name: user.name, email: user.email });
        window.location.href = 'dashboard.html';
      });
    }

    // Logout logic (for dashboard, handled inline in dashboard.html as well)
    if (window.location.pathname.endsWith('dashboard.html')) {
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
          clearSession();
          window.location.href = 'login.html';
        });
      }
    }
  })();
})(); 