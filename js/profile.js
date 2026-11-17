'use strict';
(() => {
  const E = window.Essence;
  let account = E.user();
  if (!account) { location.replace('account.html?redirect=profile.html'); return; }
  const tabs = [...document.querySelectorAll('[data-profile-tab]')];
  function showTab(name, focus = false) {
    if (!['collection', 'orders', 'details'].includes(name)) name = 'collection';
    tabs.forEach(button => {
      const selected = button.dataset.profileTab === name;
      button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
      button.id = `tab-${button.dataset.profileTab}`;
      button.setAttribute('aria-controls', `profile-${button.dataset.profileTab}`);
      const panel = document.getElementById(`profile-${button.dataset.profileTab}`);
      panel.hidden = !selected; panel.setAttribute('aria-labelledby', button.id);
      if (focus && selected) button.focus();
    });
    history.replaceState(null, '', `${location.pathname}#${name}`);
  }
  tabs.forEach((button, i) => {
    button.addEventListener('click', () => showTab(button.dataset.profileTab));
    button.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const nextIndex = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
      showTab(tabs[nextIndex].dataset.profileTab, true);
    });
  });
  showTab(location.hash.slice(1) || new URLSearchParams(location.search).get('tab') || 'collection');
  function fillDetails() {
    document.getElementById('profile-greeting').innerHTML = `Welcome back,<br><em>${E.escape(account.name.split(' ')[0])}.</em>`;
    document.getElementById('profile-avatar').textContent = account.name.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase();
    document.getElementById('profile-name').textContent = account.name;
    document.getElementById('profile-email').textContent = account.email;
    const form = document.getElementById('profile-form');
    ['name', 'email', 'phone', 'city'].forEach(key => { form.elements[key].value = account[key] || ''; });
  }
  function renderFavorites() {
    const favorites = E.getFavorites().map(E.product);
    const grid = document.getElementById('profile-favorites');
    if (favorites.length) E.renderCards(grid, favorites);
    else grid.innerHTML = E.empty('A little room for something lovely.', 'Tap the heart on a fragrance to keep it in your personal collection.');
  }
  function renderOrders() {
    const orders = E.getOrders();
    const points = orders.reduce((sum, order) => sum + Math.floor(order.total / 1000), 0);
    document.getElementById('loyalty-status').textContent = orders.length ? `${points} scent points · ${orders.length} demo order${orders.length === 1 ? '' : 's'} in your journey. A little record of what you love.` : 'Save a favourite, find an offer, and make your first discovery.';
    const list = document.getElementById('orders-list');
    if (!orders.length) { list.innerHTML = E.empty('Your journey starts here.', 'Your demo orders will stay in this account so you can discover your favourites again.', 'perfumes.html', 'Find my first fragrance', 'bag'); return; }
    list.innerHTML = [...orders].reverse().map(order => {
      const date = Number.isNaN(Date.parse(order.createdAt)) ? '' : new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Almaty' });
      return `<article class="order-card"><div class="order-card-head"><div>${E.escape(order.id)}<small>${E.escape(date)}${order.promo ? ` · ${E.escape(order.promo)}` : ''}</small></div><span class="order-status">Confirmed · demo</span></div>${order.items.map(line => { const p = E.product(line.id); if (!p) return ''; return `<div class="order-product"><img src="${p.image}" alt="${E.escape(p.name)}" loading="lazy"><div><strong>${p.name}</strong><small>${E.escape(line.ml)} ml · Quantity ${E.escape(line.quantity)}</small></div><span>${E.money(Number(line.price || 0) * Number(line.quantity || 0))}</span></div>`; }).join('')}<div class="order-footer"><span>Total ${E.money(order.total)}</span><button type="button" class="text-link" data-reorder="${E.escape(order.id)}">Find it again ${E.icon('arrow')}</button></div></article>`;
    }).join('');
  }
  const quiz = E.storage.get(E.scoped('quiz'), null);
  if (quiz?.answers?.length === 3 && ['Fresh', 'Floral', 'Woody', 'Amber'].includes(quiz.answers[0])) {
    document.getElementById('saved-quiz-summary').innerHTML = `<div class="saved-quiz"><span class="eyebrow">YOUR LAST DISCOVERY</span><h3>Your kind of ${E.escape(quiz.answers[0].toLowerCase())}.</h3><p>Your scent finder choices are ready whenever you want to explore again.</p><a href="discover.html" class="small-link">Revisit my scent direction ↗</a></div>`;
  }
  fillDetails(); renderFavorites(); renderOrders();
  document.addEventListener('essence:favorites', renderFavorites);
  document.getElementById('logout-button').addEventListener('click', () => {
    try { E.storage.remove('essence.session'); location.assign('account.html'); }
    catch (error) { E.toast(error.message, false, true); }
  });
  document.getElementById('orders-list').addEventListener('click', e => {
    const button = e.target.closest('[data-reorder]'); if (!button) return;
    const order = E.getOrders().find(o => o.id === button.dataset.reorder); if (!order) return;
    try {
      const bag = E.getCart();
      order.items.forEach(line => {
        const p = E.product(line.id); if (!p?.sizes.some(s => s.ml === line.ml)) return;
        const existing = bag.find(x => x.id === line.id && x.ml === line.ml);
        if (existing) existing.quantity = Math.min(20, existing.quantity + line.quantity);
        else bag.push({ id: line.id, ml: line.ml, quantity: Math.min(20, line.quantity) });
      });
      E.saveCart(bag); E.toast('Your favourites are back in the bag. Current demo prices apply.', true);
    } catch (error) { E.toast(error.message, false, true); }
  });
  const detailsForm = document.getElementById('profile-form');
  detailsForm.addEventListener('submit', e => {
    e.preventDefault(); E.status(detailsForm, '');
    if (!E.validate(detailsForm, { name: 'name', email: 'email', phone: 'phone', city: 'city' })) return;
    const email = detailsForm.elements.email.value.trim().toLowerCase();
    const users = E.getUsers();
    if (users.some(u => u.id !== account.id && u.email.toLowerCase() === email)) { E.setError(detailsForm.elements.email, 'Another account already uses that email.'); detailsForm.elements.email.focus(); return; }
    try {
      const updated = { ...account, name: detailsForm.elements.name.value.trim(), email, phone: detailsForm.elements.phone.value.trim(), city: detailsForm.elements.city.value };
      E.storage.set('essence.users', users.map(u => u.id === account.id ? updated : u));
      account = updated; fillDetails(); E.status(detailsForm, 'All saved. Your account feels a little more like you.');
    } catch (error) { E.status(detailsForm, error.message, true); }
  });
  const passwordForm = document.getElementById('password-form');
  passwordForm.addEventListener('submit', async e => {
    e.preventDefault(); E.status(passwordForm, '');
    if (!E.validate(passwordForm, { current: 'required', password: 'password', confirm: (value, f) => value && value === f.elements.password.value ? '' : 'Both new passwords need to match.' })) return;
    const button = passwordForm.querySelector('button[type=submit]'); button.disabled = true;
    try {
      if (await E.hashPassword(passwordForm.elements.current.value, account.salt) !== account.passwordHash) { E.setError(passwordForm.elements.current, 'Your current password doesn’t match. Try again.'); passwordForm.elements.current.focus(); return; }
      const salt = E.newId(); const passwordHash = await E.hashPassword(passwordForm.elements.password.value, salt);
      const updated = { ...account, salt, passwordHash };
      E.storage.set('essence.users', E.getUsers().map(u => u.id === account.id ? updated : u));
      account = updated; passwordForm.reset(); E.status(passwordForm, 'Your password has been updated.');
    } catch (error) { E.status(passwordForm, error.message, true); }
    finally { button.disabled = false; }
  });
})();
