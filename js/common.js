'use strict';
/* Shared browser-only state and UI. No credentials are sent to a server. */
(() => {
  const products = window.ESSENCE_PRODUCTS;
  const paths = {
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon: '<path d="M21 12.8A9 9 0 0 1 11.2 3 9 9 0 1 0 21 12.8Z"/>',
    leaf: '<path d="M20 3c-9-1-16 3-16 10a7 7 0 0 0 7 7C18 20 21 12 20 3Z"/><path d="m4 21 11-11"/>',
    bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const money = value => `${Math.round(value).toLocaleString('en-US')} ₸`;
  const product = id => products.find(item => item.id === id);
  const storage = {
    get(key, fallback) {
      try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch { throw new Error('Your browser could not save this change. Allow local storage and try again.'); }
    },
    remove(key) {
      try { localStorage.removeItem(key); }
      catch { throw new Error('Your browser could not save this change. Please allow local storage.'); }
    }
  };
  const getUsers = () => {
    const users = storage.get('essence.users', []);
    return Array.isArray(users) ? users.filter(u => u && typeof u.id === 'string' && typeof u.email === 'string' && typeof u.name === 'string') : [];
  };
  const user = () => {
    const session = storage.get('essence.session', null);
    if (!session || typeof session.userId !== 'string' || !Number.isFinite(session.expires) || session.expires < Date.now()) return null;
    return getUsers().find(u => u.id === session.userId) || null;
  };
  const scoped = name => `essence.${name}.${user()?.id || 'guest'}`;
  const getOrders = () => {
    const orders = storage.get(scoped('orders'), []);
    return Array.isArray(orders) ? orders.filter(o => o && typeof o.id === 'string' && Array.isArray(o.items) && Number.isFinite(o.total)) : [];
  };
  const getFavorites = () => {
    const saved = storage.get(scoped('favorites'), []);
    return Array.isArray(saved) ? [...new Set(saved.filter(id => product(id)))] : [];
  };
  const getCart = () => {
    const bag = storage.get(scoped('cart'), []);
    if (!Array.isArray(bag)) return [];
    // Stored data is untrusted: validate every ID, volume and quantity before use.
    const clean = [];
    bag.forEach(line => {
      const p = product(line?.id);
      if (!p || !p.sizes.some(s => s.ml === line.ml) || !Number.isInteger(line.quantity) || line.quantity < 1) return;
      const existing = clean.find(x => x.id === line.id && x.ml === line.ml);
      if (existing) existing.quantity = Math.min(20, existing.quantity + line.quantity);
      else clean.push({ id: line.id, ml: line.ml, quantity: Math.min(20, line.quantity) });
    });
    return clean;
  };
  let toastTimer;
  function toast(message, bagLink = false, error = false) {
    const region = document.getElementById('toast-region');
    if (!region) return;
    clearTimeout(toastTimer);
    region.innerHTML = `<div class="toast"${error ? ' role="alert"' : ''}>${escape(message)}${bagLink ? '<a href="cart.html">View bag ↗</a>' : ''}</div>`;
    toastTimer = setTimeout(() => { region.textContent = ''; }, 4200);
  }
  function updateBadges() {
    const count = getCart().reduce((sum, line) => sum + line.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = String(count); el.hidden = count === 0; });
    document.querySelector('.bag-link')?.setAttribute('aria-label', `Shopping bag, ${count} item${count === 1 ? '' : 's'}`);
    const saved = getFavorites();
    document.querySelectorAll('[data-favorite-count]').forEach(el => { el.textContent = String(saved.length); el.hidden = !saved.length; });
    document.querySelectorAll('[data-favorite-id]').forEach(button => {
      const p = product(button.dataset.favoriteId);
      const selected = saved.includes(button.dataset.favoriteId);
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-label', `${selected ? 'Remove' : 'Save'} ${p?.name || 'fragrance'}${selected ? ' from favourites' : ' to favourites'}`);
    });
    const account = document.getElementById('account-link');
    if (account) { account.href = user() ? 'profile.html' : 'account.html'; account.setAttribute('aria-label', user() ? 'My profile' : 'Log in or create account'); }
  }
  function saveCart(bag) {
    storage.set(scoped('cart'), bag);
    updateBadges();
    document.dispatchEvent(new CustomEvent('essence:cart'));
  }
  function addToCart(id, ml, quantity = 1) {
    const p = product(id);
    if (!p || !p.sizes.some(size => size.ml === ml)) throw new Error('Please choose a bottle size from this collection.');
    const bag = getCart();
    const line = bag.find(item => item.id === id && item.ml === ml);
    if (line && line.quantity + quantity > 20) throw new Error('You can add up to 20 bottles of each size to a demo order.');
    if (line) line.quantity += quantity;
    else bag.push({ id, ml, quantity: Math.min(20, quantity) });
    saveCart(bag);
  }
  function toggleFavorite(id) {
    if (!product(id)) return;
    const saved = getFavorites();
    const exists = saved.includes(id);
    storage.set(scoped('favorites'), exists ? saved.filter(x => x !== id) : [...saved, id]);
    updateBadges();
    document.dispatchEvent(new CustomEvent('essence:favorites'));
    toast(exists ? 'Removed from your saved collection.' : 'Kept close. Saved to your collection.');
  }
  function card(p, index = 0) {
    const size = p.sizes[0];
    return `<article class="product-card" data-product-id="${p.id}"><div class="product-photo"><a class="product-image-link" href="product.html?id=${p.id}" aria-label="Explore ${escape(p.name)}"><img src="${p.image}" alt="${escape(p.brand)} ${escape(p.name)} fragrance bottle" loading="lazy" width="500" height="600"></a><button class="icon-button product-save" type="button" data-favorite-id="${p.id}" aria-pressed="${getFavorites().includes(p.id)}" aria-label="Save ${escape(p.name)} to favourites">${icon('heart')}</button><span class="product-label">${p.label}</span></div><div class="product-info"><span class="product-brand">${p.brand}</span><h3><a href="product.html?id=${p.id}">${p.name}</a></h3><p class="product-type">${p.type} · ${p.gender}</p><p class="product-notes">${p.notes.slice(0, 3).join(' · ')}</p><div class="product-sizes" role="group" aria-label="Bottle size for ${escape(p.name)}">${p.sizes.map((s, i) => `<button type="button" class="size-chip" data-card-size="${s.ml}" aria-pressed="${i === 0}">${s.ml} ml</button>`).join('')}</div><div class="product-buy"><span class="product-price">${money(size.price)}</span><button class="add-to-bag" type="button" data-add-id="${p.id}" data-add-size="${size.ml}" aria-label="Add ${escape(p.name)}, ${size.ml} ml to bag">${icon('plus')}</button></div></div></article>`;
  }
  function renderCards(container, items) { if (container) { container.innerHTML = items.map(card).join(''); updateBadges(); } }
  function empty(title, text, href = 'perfumes.html', cta = 'Explore the collection', symbol = 'heart') {
    return `<div class="empty-state">${icon(symbol)}<h2>${escape(title)}</h2><p>${escape(text)}</p><a href="${href}" class="button">${escape(cta)}${icon('arrow')}</a></div>`;
  }
  const validators = {
    name(value) { return value.trim().length >= 2 && value.trim().length <= 80 ? '' : 'Please enter your name, between 2 and 80 characters.'; },
    email(value) { return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Enter an email address like name@example.com.'; },
    phone(value) { return /^[+\d\s()\-]+$/.test(value) && /^[78]\d{10}$/.test(value.replace(/\D/g, '')) ? '' : 'Use +7 and 10 digits, for example +7 707 123 45 67.'; },
    password(value) { return value.length >= 8 && value.length <= 128 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9\s]/.test(value) ? '' : 'Use 8–128 characters with an uppercase letter, lowercase letter, number and symbol.'; },
    required(value) { return value.trim() ? '' : 'Please fill in this field.'; },
    city(value) { return ['Astana', 'Almaty', 'Oral', 'Shymkent', 'Other'].includes(value) ? '' : 'Please choose a city.'; },
    message(value) { return value.trim().length >= 10 && value.trim().length <= 2000 ? '' : 'Write a message between 10 and 2,000 characters.'; },
    address(value) { return value.trim().length >= 5 && value.trim().length <= 200 ? '' : 'Enter an address between 5 and 200 characters.'; }
  };
  function setError(input, message) {
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    // Follow the field's declared error relationship, including newsletter and promo fields.
    const errorId = (input.getAttribute('aria-describedby') || '').split(/\s+/).find(id => id.endsWith('-error'));
    const error = document.getElementById(errorId || `${input.id}-error`);
    if (error) error.textContent = message;
  }
  function validate(form, rules) {
    let first;
    Object.entries(rules).forEach(([name, rule]) => {
      const input = form.elements.namedItem(name);
      if (!input) return;
      const value = input.value;
      const message = typeof rule === 'function' ? rule(value, form) : validators[rule](value);
      setError(input, message);
      if (message && !first) first = input;
    });
    if (first) first.focus();
    return !first;
  }
  function status(form, message, error = false) {
    const el = form.querySelector('.form-status');
    if (el) { el.textContent = message; el.classList.toggle('error', error); }
  }
  async function hashPassword(password, salt) {
    if (!globalThis.crypto?.subtle) throw new Error('Open the hosted site or localhost to create a demo account securely.');
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 120000, hash: 'SHA-256' }, material, 256);
    return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  const newId = () => globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  function signIn(account) {
    // Merge the guest bag and saved collection once, then keep each account isolated.
    const guestCart = getCart();
    const guestFavorites = getFavorites();
    const guestQuiz = storage.get(scoped('quiz'), null);
    storage.set('essence.session', { userId: account.id, expires: Date.now() + 7 * 86400000 });
    if (guestCart.length) {
      const bag = getCart();
      guestCart.forEach(line => {
        const existing = bag.find(x => x.id === line.id && x.ml === line.ml);
        if (existing) existing.quantity = Math.min(20, existing.quantity + line.quantity);
        else bag.push(line);
      });
      storage.set(scoped('cart'), bag);
      storage.remove('essence.cart.guest');
    }
    if (guestFavorites.length) {
      storage.set(scoped('favorites'), [...new Set([...getFavorites(), ...guestFavorites])]);
      storage.remove('essence.favorites.guest');
    }
    // Carry a guest's latest scent discovery into their account without replacing a newer one.
    const options = [['Fresh', 'Floral', 'Woody', 'Amber'], ['everyday', 'evening', 'gift'], ['soft', 'bold']];
    const validQuiz = quiz => quiz && Array.isArray(quiz.answers) && quiz.answers.length === 3 && Number.isFinite(quiz.savedAt) && quiz.answers.every((answer, i) => options[i].includes(answer));
    if (validQuiz(guestQuiz)) {
      const accountQuiz = storage.get(scoped('quiz'), null);
      if (!validQuiz(accountQuiz) || guestQuiz.savedAt > accountQuiz.savedAt) storage.set(scoped('quiz'), guestQuiz);
      storage.remove('essence.quiz.guest');
    }
    updateBadges();
  }
  const redirectTarget = () => {
    const target = new URLSearchParams(location.search).get('redirect');
    return ['profile.html', 'cart.html', 'perfumes.html'].includes(target) ? target : 'profile.html';
  };
  const subtotal = (bag = getCart()) => bag.reduce((sum, line) => sum + product(line.id).sizes.find(s => s.ml === line.ml).price * line.quantity, 0);
  function checkPromo(code, amount = subtotal()) {
    const normal = String(code || '').trim().toUpperCase();
    if (!normal) return { code: '', valid: false, error: 'Enter a promo code first.' };
    if (!['WELCOME10', 'ESSENCE15', 'FREESHIP'].includes(normal)) return { code: normal, valid: false, error: 'That code is not in our edit. Try WELCOME10, ESSENCE15 or FREESHIP.' };
    if (amount <= 0) return { code: normal, valid: false, error: 'Add a fragrance to your bag before applying a code.' };
    if (normal === 'WELCOME10' && getOrders().length) return { code: normal, valid: false, error: 'WELCOME10 is for your first order. Try ESSENCE15 or FREESHIP.' };
    if (normal === 'ESSENCE15' && amount < 75000) return { code: normal, valid: false, error: `Add ${money(75000 - amount)} more to use ESSENCE15.` };
    if (normal === 'FREESHIP' && amount >= 80000) return { code: normal, valid: false, error: 'Your delivery is already free. Try a percentage code for an extra saving.' };
    return { code: normal, valid: true, rate: normal === 'WELCOME10' ? .10 : normal === 'ESSENCE15' ? .15 : 0, freeShipping: normal === 'FREESHIP' };
  }
  function totals(bag = getCart(), code = storage.get(scoped('promo'), '')) {
    const amount = subtotal(bag);
    const promo = checkPromo(code, amount);
    const discount = promo.valid ? Math.round(amount * promo.rate) : 0;
    const delivery = amount === 0 || amount >= 80000 || (promo.valid && promo.freeShipping) ? 0 : 2000;
    return { subtotal: amount, discount, delivery, total: amount - discount + delivery, promo };
  }
  function applyTheme(mode) {
    document.documentElement.dataset.theme = mode;
    const toggle = document.getElementById('theme-toggle');
    if (toggle) { toggle.innerHTML = icon(mode === 'dark' ? 'sun' : 'moon'); toggle.setAttribute('aria-pressed', String(mode === 'dark')); toggle.setAttribute('aria-label', `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`); }
  }
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('essence.theme', next); applyTheme(next); } catch { toast('Your browser could not save the colour mode.', false, true); }
  });
  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  function closeMenu() { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); menu?.setAttribute('aria-label', 'Open navigation'); }
  menu?.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(opened)); menu.setAttribute('aria-label', `${opened ? 'Close' : 'Open'} navigation`);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav?.classList.contains('open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
  async function copyCode(button) {
    const value = button.dataset.copy;
    let copied = false;
    try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(value); copied = true; } } catch { /* Fall back when clipboard permissions are unavailable. */ }
    if (!copied) {
      const area = document.createElement('textarea'); area.value = value; area.setAttribute('aria-label', 'Promo code to copy'); area.style.position = 'fixed'; area.style.left = '-9999px'; document.body.append(area); area.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      area.remove(); button.focus();
    }
    toast(copied ? `${value} copied. Apply it in your bag.` : `Your code is ${value}. Select and copy it manually.`, false, !copied);
  }
  document.addEventListener('click', async e => {
    const copy = e.target.closest('[data-copy]');
    if (copy) { await copyCode(copy); return; }
    const show = e.target.closest('[data-password]');
    if (show) {
      const input = document.getElementById(show.dataset.password); const visible = input.type === 'password'; input.type = visible ? 'text' : 'password'; show.textContent = visible ? 'Hide' : 'Show'; show.setAttribute('aria-label', `${visible ? 'Hide' : 'Show'} password`); show.setAttribute('aria-pressed', String(visible)); return;
    }
    try {
      const favorite = e.target.closest('[data-favorite-id]');
      if (favorite) { toggleFavorite(favorite.dataset.favoriteId); return; }
      const size = e.target.closest('[data-card-size]');
      if (size) {
        const article = size.closest('.product-card'); const p = product(article.dataset.productId); const ml = Number(size.dataset.cardSize);
        article.querySelectorAll('[data-card-size]').forEach(b => b.setAttribute('aria-pressed', String(b === size)));
        article.querySelector('.product-price').textContent = money(p.sizes.find(s => s.ml === ml).price);
        const add = article.querySelector('[data-add-id]'); add.dataset.addSize = String(ml); add.setAttribute('aria-label', `Add ${p.name}, ${ml} ml to bag`); return;
      }
      const add = e.target.closest('[data-add-id]');
      if (add) { const p = product(add.dataset.addId); addToCart(p.id, Number(add.dataset.addSize)); toast(`${p.name}, ${add.dataset.addSize} ml added.`, true); }
    } catch (error) { toast(error.message, false, true); }
  });
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.elements.email;
      const error = validators.email(input.value);
      document.getElementById('newsletter-error').textContent = error;
      input.setAttribute('aria-invalid', String(Boolean(error)));
      if (error) { input.focus(); return; }
      try {
        const email = input.value.trim().toLowerCase();
        const list = storage.get('essence.subscribers', []); const subscribers = Array.isArray(list) ? list : [];
        if (subscribers.includes(email)) { status(form, 'You’re already on the list. Your welcome code is WELCOME10.'); return; }
        storage.set('essence.subscribers', [...subscribers, email]);
        status(form, 'You’re on the list. Use WELCOME10 for your first demo order.'); form.reset();
      } catch (error) { status(form, error.message, true); }
    });
  });
  document.querySelectorAll('form').forEach(form => form.addEventListener('input', e => {
    if (e.target.matches('input,textarea,select') && e.target.getAttribute('aria-invalid') === 'true') setError(e.target, '');
  }));
  const topButton = document.getElementById('back-top');
  if (topButton) {
    window.addEventListener('scroll', () => { topButton.hidden = window.scrollY < 650; }, { passive: true });
    topButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); document.querySelector('.wordmark')?.focus({ preventScroll: true }); });
  }
  window.addEventListener('storage', e => {
    if (e.key === 'essence.theme') applyTheme(e.newValue === 'dark' ? 'dark' : 'light');
    if (e.key?.includes('cart')) { updateBadges(); document.dispatchEvent(new CustomEvent('essence:cart')); }
    if (e.key?.includes('favorites')) { updateBadges(); document.dispatchEvent(new CustomEvent('essence:favorites')); }
    if (e.key === 'essence.session') location.reload();
  });
  window.Essence = { products, product, escape, money, icon, storage, getUsers, user, scoped, getOrders, getFavorites, getCart, saveCart, addToCart, updateBadges, toast, card, renderCards, empty, validators, setError, validate, status, hashPassword, newId, signIn, redirectTarget, checkPromo, totals, subtotal };
  updateBadges();
})();
