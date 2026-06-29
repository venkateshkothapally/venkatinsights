/*
  auth.js
  Static-site mock authentication (LOCALSTORAGE ONLY).

  Supports:
  - Signup (Gmail/Google email + mobile)
  - OTP verification
  - Login/logout

  NOTE: Real Gmail OAuth + SMS/WhatsApp OTP requires a backend + provider.
*/

(function () {
  const LS_KEYS = {
    users: 'vi_users_v1',
    otpRequests: 'vi_otp_requests_v1',
    session: 'vi_session_v1'
  };

  function safeParse(json, fallback) {
    try { return JSON.parse(json); } catch { return fallback; }
  }

  function getUsers() {
    return safeParse(localStorage.getItem(LS_KEYS.users), []);
  }

  function setUsers(users) {
    localStorage.setItem(LS_KEYS.users, JSON.stringify(users));
  }

  function getOtpRequests() {
    return safeParse(localStorage.getItem(LS_KEYS.otpRequests), {});
  }

  function setOtpRequests(obj) {
    localStorage.setItem(LS_KEYS.otpRequests, JSON.stringify(obj));
  }

  function setSession(session) {
    localStorage.setItem(LS_KEYS.session, JSON.stringify(session));
  }

  function getSession() {
    return safeParse(localStorage.getItem(LS_KEYS.session), null);
  }

  function normalizeEmail(e) {
    return String(e || '').trim().toLowerCase();
  }

  // Simple non-crypto demo hash (NOT secure). For demo only.
  function demoHash(str) {
    let h = 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h.toString(16);
  }

  function generateOtp6() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function setMessage(id, msg, isError = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#b91c1c' : 'var(--muted)';
  }

  function required(condition, msg, isError = true) {
    if (!condition) {
      setMessage('authMessage', msg, isError);
      return false;
    }
    return true;
  }

  async function onSignupSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fullName = form.fullName?.value?.trim();
    const email = normalizeEmail(form.email?.value);
    const mobile = String(form.mobile?.value || '').trim();
    const password = form.password?.value;

    if (!required(!!fullName, 'Enter full name')) return;
    if (!required(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter valid email')) return;
    if (!required(/^\d{10,15}$/.test(mobile), 'Enter valid mobile number (10-15 digits)')) return;
    if (!required(String(password || '').length >= 6, 'Password must be at least 6 characters')) return;

    const users = getUsers();
    if (users.some(u => normalizeEmail(u.email) === email)) {
      setMessage('authMessage', 'Email already registered. Please login.', true);
      return;
    }

    const otp = generateOtp6();
    const otpReqs = getOtpRequests();
    otpReqs[email] = {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      mobile,
      fullName,
      passwordHash: demoHash(password),
      verified: false
    };
    setOtpRequests(otpReqs);

    // Demo: show OTP directly on screen.
    setMessage('authMessage', `OTP generated for demo: ${otp}. Enter it on OTP page.`, false);

    // WhatsApp preview (no real OTP sending)
    const wa = document.getElementById('whatsAppPreview');
    if (wa) {
      wa.href = `https://api.whatsapp.com/send/?phone=${encodeURIComponent(mobile)}&text=${encodeURIComponent('Your demo OTP is: ' + otp)}`;
      wa.textContent = 'Open WhatsApp (demo message)';
    }

    // Navigate to OTP page.
    window.location.href = 'otp.html';
  }

  async function onOtpSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const otpInput = String(form.otp?.value || '').trim();
    const email = normalizeEmail(form.email?.value);

    if (!required(/^\d{6}$/.test(otpInput), 'Enter valid 6-digit OTP')) return;
    if (!required(!!email, 'Email is required')) return;

    const otpReqs = getOtpRequests();
    const req = otpReqs[email];
    if (!req) {
      setMessage('authMessage', 'No OTP request found. Please sign up again.', true);
      return;
    }
    if (Date.now() > req.expiresAt) {
      setMessage('authMessage', 'OTP expired. Please request a new OTP.', true);
      return;
    }
    if (String(req.otp) !== otpInput) {
      setMessage('authMessage', 'Incorrect OTP. Please try again.', true);
      return;
    }

    // Create user now.
    const users = getUsers();
    const exists = users.some(u => normalizeEmail(u.email) === email);
    if (!exists) {
      users.push({
        fullName: req.fullName,
        email,
        mobile: req.mobile,
        passwordHash: req.passwordHash,
        createdAt: Date.now()
      });
      setUsers(users);
    }

    req.verified = true;
    setOtpRequests(otpReqs);

    setSession({ email, fullName: req.fullName, createdAt: Date.now() });
    setMessage('authMessage', 'OTP verified. Login successful - redirecting...', false);
    setTimeout(() => window.location.href = 'login.html', 900);
  }

  async function onLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = normalizeEmail(form.email?.value);
    const password = form.password?.value;

    if (!required(!!email, 'Email is required')) return;
    if (!required(String(password || '').length >= 1, 'Password is required')) return;

    const users = getUsers();
    const user = users.find(u => normalizeEmail(u.email) === email);
    if (!user) {
      setMessage('authMessage', 'Account not found. Please sign up.', true);
      return;
    }

    const ok = demoHash(password) === user.passwordHash;
    if (!ok) {
      setMessage('authMessage', 'Invalid password.', true);
      return;
    }

    setSession({ email: user.email, fullName: user.fullName, createdAt: Date.now() });
    setMessage('authMessage', 'Login successful - redirecting...', false);
    setTimeout(() => window.location.href = 'index.html', 900);
  }

  function setupLogout() {
    const btn = document.getElementById('logoutBtn');
    const box = document.getElementById('logoutBox');
    const userEl = document.getElementById('loggedUser');

    if (!btn) return;

    const session = getSession();
    if (userEl) {
      userEl.textContent = session ? `Logged in: ${session.fullName || session.email}` : 'Not logged in';
    }

    btn.addEventListener('click', () => {
      localStorage.removeItem(LS_KEYS.session);
      if (userEl) userEl.textContent = 'Not logged in';
      setMessage('authMessage', 'Logged out.', false);
    });
  }

  function initPageRouting() {
    const page = window.__AUTH_PAGE__ || '';

    if (page === 'signup') {
      const form = document.getElementById('signupForm');
      form?.addEventListener('submit', onSignupSubmit);
    }

    if (page === 'otp') {
      const form = document.getElementById('otpForm');
      form?.addEventListener('submit', onOtpSubmit);

      // Show debug info + whatsapp preview based on latest request.
      const otpDebug = document.getElementById('otpDebug');
      const wa = document.getElementById('whatsAppPreview');
      const reqs = getOtpRequests();
      const emails = Object.keys(reqs);
      const last = emails.length ? reqs[emails[emails.length - 1]] : null;

      if (otpDebug && last) {
        otpDebug.textContent = `Latest demo OTP: ${last.otp} (expires in ~${Math.max(0, Math.floor((last.expiresAt - Date.now())/60000))} min).`;
      }
      if (wa && last) {
        wa.href = `https://api.whatsapp.com/send/?phone=${encodeURIComponent(last.mobile)}&text=${encodeURIComponent('Your demo OTP is: ' + last.otp)}`;
        wa.textContent = 'Open WhatsApp (demo message)';
      }
    }

    if (page === 'login') {
      const form = document.getElementById('loginForm');
      form?.addEventListener('submit', onLoginSubmit);
      setupLogout();
    }
  }

  // Auto initialize
  document.addEventListener('DOMContentLoaded', initPageRouting);
})();

