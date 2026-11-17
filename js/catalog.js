'use strict';
(() => {
  const E = window.Essence;
  const defaults = { search: '', family: '', gender: '', price: '', saved: false, sort: 'featured' };
  const stored = E.storage.get('essence.filters', {});
  const state = { ...defaults, ...(stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}) };
  const query = new URLSearchParams(location.search);
  // An explicit link starts a fresh filter so a saved choice never hides its results.
  if ([...query.keys()].length) {
    Object.assign(state, defaults);
    state.search = query.get('q') || '';
    state.family = query.get('family') || '';
    state.gender = query.get('gender') || '';
    state.saved = query.get('saved') === '1';
    state.sort = query.get('sort') || 'featured';
  }
  if (!['', 'Floral', 'Woody', 'Amber', 'Fresh'].includes(state.family)) state.family = '';
  if (!['', 'Women', 'Men', 'Unisex'].includes(state.gender)) state.gender = '';
  if (!['', '50000', '75000'].includes(state.price)) state.price = '';
  if (!['featured', 'price-asc', 'price-desc', 'name'].includes(state.sort)) state.sort = 'featured';
  state.search = typeof state.search === 'string' ? state.search.slice(0, 150) : '';
  state.saved = state.saved === true;
  const search = document.getElementById('catalog-search');
  const gender = document.getElementById('gender-filter');
  const price = document.getElementById('price-filter');
  const saved = document.getElementById('saved-filter');
  const sort = document.getElementById('sort-filter');
  function syncControls() {
    search.value = state.search; gender.value = state.gender; price.value = state.price; saved.checked = state.saved; sort.value = state.sort;
    document.querySelectorAll('[data-filter-family]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filterFamily === state.family)));
    document.getElementById('clear-search').hidden = !state.search;
  }
  function render(persist = true) {
    const text = state.search.trim().toLowerCase();
    const favorites = E.getFavorites();
    const filtered = E.products.filter(p => (!text || `${p.name} ${p.brand} ${p.notes.join(' ')} ${p.family}`.toLowerCase().includes(text)) && (!state.family || p.family === state.family) && (!state.gender || p.gender === state.gender) && (!state.price || p.sizes[0].price <= Number(state.price)) && (!state.saved || favorites.includes(p.id)));
    if (state.sort === 'price-asc') filtered.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
    if (state.sort === 'price-desc') filtered.sort((a, b) => b.sizes[0].price - a.sizes[0].price);
    if (state.sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    const grid = document.getElementById('catalog-products');
    if (filtered.length) E.renderCards(grid, filtered);
    else grid.innerHTML = `<div class="empty-state">${E.icon('search')}<h2>A little too specific?</h2><p>${state.saved ? 'Your saved fragrances will appear here. Try clearing the filters, then tap a heart on any fragrance.' : 'No fragrance matches all those choices. Clear the filters and explore a little.'}</p><button type="button" id="empty-reset" class="button">See the full edit ${E.icon('arrow')}</button></div>`;
    document.getElementById('result-count').textContent = `${filtered.length} fragrance${filtered.length === 1 ? '' : 's'}${text ? ` for “${state.search.trim()}”` : ' in your edit'}`;
    syncControls();
    if (persist) {
      try { E.storage.set('essence.filters', state); } catch (error) { E.toast(error.message, false, true); }
      const params = new URLSearchParams();
      if (state.search) params.set('q', state.search);
      if (state.family) params.set('family', state.family);
      if (state.gender) params.set('gender', state.gender);
      if (state.saved) params.set('saved', '1');
      if (state.sort !== 'featured') params.set('sort', state.sort);
      history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
    }
  }
  function reset() { Object.assign(state, defaults); render(); }
  search.addEventListener('input', () => { state.search = search.value.slice(0, 150); render(); });
  document.getElementById('clear-search').addEventListener('click', () => { state.search = ''; render(); search.focus(); });
  gender.addEventListener('change', () => { state.gender = gender.value; render(); });
  price.addEventListener('change', () => { state.price = price.value; render(); });
  saved.addEventListener('change', () => { state.saved = saved.checked; render(); });
  sort.addEventListener('change', () => { state.sort = sort.value; render(); });
  document.getElementById('family-filters').addEventListener('click', e => { const b = e.target.closest('[data-filter-family]'); if (b) { state.family = b.dataset.filterFamily; render(); } });
  document.getElementById('reset-filters').addEventListener('click', reset);
  document.addEventListener('click', e => { if (e.target.closest('#empty-reset')) reset(); });
  document.addEventListener('essence:favorites', () => { if (state.saved) render(false); });
  render(false);
})();
