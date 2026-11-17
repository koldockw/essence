'use strict';
(() => {
  const E = window.Essence;
  if (E.user()) { location.replace(E.redirectTarget()); return; }
  const login = document.getElementById('login-form');
  const signup = document.getElementById('signup-form');
  const tabs = [document.getElementById('login-tab'), document.getElementById('signup-tab')];
  function setTab(name, focus = false) {
    const signingUp = name === 'signup';
    tabs.forEach((tab, i) => { const active = signingUp === (i === 1); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    document.getElementById('login-panel').hidden = signingUp;
    document.getElementById('signup-panel').hidden = !signingUp;
    history.replaceState(null, '', `${location.pathname}${location.search}${signingUp ? '#signup' : '#login'}`);
    if (focus) tabs[signingUp ? 1 : 0].focus();
  }
  tabs[0].addEventListener('click', () => setTab('login'));
  tabs[1].addEventListener('click', () => setTab('signup'));
  tabs.forEach(tab => tab.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); setTab(e.key === 'Home' ? 'login' : e.key === 'End' ? 'signup' : tabs[0].getAttribute('aria-selected') === 'true' ? 'signup' : 'login', true); } }));
  document.querySelectorAll('[data-auth-tab]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.authTab, true)));
  setTab(location.hash === '#signup' ? 'signup' : 'login');
  function busy(form, value) { form.querySelector('button[type=submit]').disabled = value; form.setAttribute('aria-busy', String(value)); }
  signup.addEventListener('submit', async e => {
    e.preventDefault(); E.status(signup, '');
    if (!E.validate(signup, { name: 'name', email: 'email', phone: 'phone', password: 'password', confirm: (value, f) => value === f.elements.password.value && value ? '' : 'Both passwords need to match.' })) return;
    const email = signup.elements.email.value.trim().toLowerCase();
    const users = E.getUsers();
    if (users.some(u => u.email.toLowerCase() === email)) { E.setError(signup.elements.email, 'There’s already an account with this email. Try logging in.'); signup.elements.email.focus(); return; }
    busy(signup, true);
    try {
      const salt = E.newId();
      const passwordHash = await E.hashPassword(signup.elements.password.value, salt);
      const account = { id: E.newId(), name: signup.elements.name.value.trim(), email, phone: signup.elements.phone.value.trim(), city: 'Astana', salt, passwordHash, createdAt: new Date().toISOString() };
      E.storage.set('essence.users', [...users, account]);
      E.signIn(account);
      E.status(signup, 'Your account is ready. Opening your collection…');
      signup.reset();
      location.assign(E.redirectTarget());
    } catch (error) { E.status(signup, error.message, true); busy(signup, false); }
  });
  login.addEventListener('submit', async e => {
    e.preventDefault(); E.status(login, '');
    if (!E.validate(login, { email: 'email', password: 'password' })) return;
    busy(login, true);
    try {
      const account = E.getUsers().find(u => u.email.toLowerCase() === login.elements.email.value.trim().toLowerCase());
      if (!account || !account.salt || !account.passwordHash || await E.hashPassword(login.elements.password.value, account.salt) !== account.passwordHash) {
        E.status(login, 'That email and password don’t match. Check them and try again.', true); login.elements.password.focus(); busy(login, false); return;
      }
      E.signIn(account); E.status(login, 'Welcome back. Opening your collection…'); login.reset(); location.assign(E.redirectTarget());
    } catch (error) { E.status(login, error.message, true); busy(login, false); }
  });
})();
