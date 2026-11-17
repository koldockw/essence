'use strict';
(() => {
  const E = window.Essence;
  E.renderCards(document.getElementById('featured-products'), E.products.slice(0, 4));
  const account = E.user();
  if (account) {
    const note = document.querySelector('.hero-footnote');
    note.innerHTML = `<span class="line"></span><a href="profile.html">Welcome back, ${E.escape(account.name.split(' ')[0])}. Your collection is waiting ↗</a>`;
  }
})();
