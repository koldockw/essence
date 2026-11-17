'use strict';
(() => {
  const E = window.Essence;
  const content = document.getElementById('cart-content');
  const form = document.getElementById('checkout-form');
  const promoForm = document.getElementById('promo-form');
  let complete = false;
  const account = E.user();
  if (account) ['name', 'email', 'phone', 'city'].forEach(key => { form.elements[key].value = account[key] || ''; });
  function render() {
    if (complete) return;
    const bag = E.getCart();
    const empty = !bag.length;
    content.classList.toggle('is-empty', empty);
    document.querySelector('.order-summary').hidden = empty;
    document.getElementById('checkout-panel').hidden = empty;
    document.querySelector('.continue-link').hidden = empty;
    const items = document.getElementById('cart-items');
    if (empty) { items.innerHTML = E.empty('A little room for a new favourite.', 'Your bag is waiting for a fragrance that feels like you.', 'perfumes.html', 'Explore the collection', 'bag'); return; }
    items.innerHTML = bag.map(line => {
      const p = E.product(line.id); const size = p.sizes.find(s => s.ml === line.ml);
      return `<article class="cart-item"><a class="cart-item-img" href="product.html?id=${p.id}" aria-label="Explore ${E.escape(p.name)}"><img src="${p.image}" alt="${E.escape(p.name)} fragrance bottle"></a><div class="cart-item-info"><span class="product-brand">${p.brand}</span><h3><a href="product.html?id=${p.id}">${p.name}</a></h3><span class="small-text">${p.type} · ${line.ml} ml</span><div class="cart-item-actions"><div class="quantity-stepper" aria-label="Quantity for ${E.escape(p.name)}, ${line.ml} ml"><button type="button" data-quantity="-1" data-id="${p.id}" data-ml="${line.ml}" aria-label="Decrease ${E.escape(p.name)}, ${line.ml} ml quantity">−</button><span aria-live="polite">${line.quantity}</span><button type="button" data-quantity="1" data-id="${p.id}" data-ml="${line.ml}" aria-label="Increase ${E.escape(p.name)}, ${line.ml} ml quantity">+</button></div><button type="button" class="cart-remove" data-remove="${p.id}" data-ml="${line.ml}" aria-label="Remove ${E.escape(p.name)}, ${line.ml} ml from bag">Remove</button></div></div><strong>${E.money(size.price * line.quantity)}</strong></article>`;
    }).join('');
    const total = E.totals(bag);
    const activeCode = E.storage.get(E.scoped('promo'), '');
    document.getElementById('cart-totals').innerHTML = `<div class="total-row"><span>Fragrances <small>${bag.reduce((sum, l) => sum + l.quantity, 0)} bottle${bag.reduce((sum, l) => sum + l.quantity, 0) === 1 ? '' : 's'}</small></span><span>${E.money(total.subtotal)}</span></div>${total.discount ? `<div class="total-row discount"><span>${E.escape(total.promo.code)} saving</span><span>−${E.money(total.discount)}</span></div>` : ''}<div class="total-row"><span>Demo delivery</span><span>${total.delivery ? E.money(total.delivery) : 'On us'}</span></div><div class="total-row grand-total"><span>Total</span><strong>${E.money(total.total)}</strong></div>`;
    document.getElementById('applied-promo').innerHTML = activeCode ? `<div class="applied-code"><span>${E.escape(activeCode)} ${total.promo.valid ? '✓' : '(inactive)'}</span><button type="button" id="remove-promo">Remove</button></div>` : '';
    document.getElementById('promo-error').textContent = activeCode && !total.promo.valid ? total.promo.error : '';
    const progress = Math.min(100, total.subtotal / 80000 * 100);
    const deliveredFree = !total.delivery;
    document.getElementById('delivery-progress').innerHTML = `<div style="--progress:${progress}%"><i></i></div><p>${deliveredFree ? 'A little extra: your demo delivery is on us.' : `You’re ${E.money(80000 - total.subtotal)} from free demo delivery.`}</p>`;
  }
  document.getElementById('cart-items').addEventListener('click', e => {
    const quantity = e.target.closest('[data-quantity]');
    const remove = e.target.closest('[data-remove]');
    if (!quantity && !remove) return;
    try {
      let bag = E.getCart();
      if (remove) bag = bag.filter(line => !(line.id === remove.dataset.remove && line.ml === Number(remove.dataset.ml)));
      else {
        const line = bag.find(l => l.id === quantity.dataset.id && l.ml === Number(quantity.dataset.ml));
        if (!line) return;
        const next = line.quantity + Number(quantity.dataset.quantity);
        if (next > 20) { E.toast('Up to 20 bottles of each size per demo order.'); return; }
        if (next < 1) bag = bag.filter(l => l !== line); else line.quantity = next;
      }
      E.saveCart(bag);
    } catch (error) { E.toast(error.message, false, true); }
  });
  promoForm.addEventListener('submit', e => {
    e.preventDefault(); E.status(promoForm, '');
    const promo = E.checkPromo(promoForm.elements.promo.value);
    const input = promoForm.elements.promo;
    input.setAttribute('aria-invalid', String(!promo.valid));
    if (!promo.valid) { document.getElementById('promo-error').textContent = promo.error; input.focus(); return; }
    try {
      E.storage.set(E.scoped('promo'), promo.code); input.value = promo.code; render();
      E.status(promoForm, promo.freeShipping ? 'A lighter delivery. It’s on us.' : `${promo.rate * 100}% off, just like that.`);
    } catch (error) { E.status(promoForm, error.message, true); }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#remove-promo')) return;
    try { E.storage.remove(E.scoped('promo')); promoForm.reset(); E.status(promoForm, ''); render(); }
    catch (error) { E.toast(error.message, false, true); }
  });
  document.addEventListener('essence:cart', render);
  form.addEventListener('submit', e => {
    e.preventDefault(); E.status(form, '');
    if (complete || !E.getCart().length) return;
    if (!E.validate(form, { name: 'name', email: 'email', phone: 'phone', city: 'city', address: 'address' })) return;
    const button = form.querySelector('button[type=submit]'); button.disabled = true;
    try {
      const bag = E.getCart(); const total = E.totals(bag);
      const order = {
        id: `ES-${new Date().getFullYear()}-${E.newId().replaceAll('-', '').slice(-6).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        customer: Object.fromEntries(new FormData(form)),
        items: bag.map(line => ({ ...line, price: E.product(line.id).sizes.find(s => s.ml === line.ml).price })),
        subtotal: total.subtotal, discount: total.discount, delivery: total.delivery, total: total.total,
        promo: total.promo.valid ? total.promo.code : '', status: 'demo-confirmed'
      };
      E.storage.set(E.scoped('orders'), [...E.getOrders(), order]);
      complete = true;
      E.saveCart([]); E.storage.remove(E.scoped('promo'));
      content.hidden = true;
      const success = document.getElementById('order-success'); success.hidden = false;
      success.innerHTML = `<section class="order-confirmation"><span class="success-icon">${E.icon('check')}</span><span class="eyebrow">A LOVELY LITTLE CHOICE</span><h2>It’s yours.<br><em>At least, for the demo.</em></h2><p class="order-number">${E.escape(order.id)}</p><p>Thank you, ${E.escape(order.customer.name.split(' ')[0])}. Your demo order for ${E.money(order.total)} is saved in this browser${account ? ' and in your account' : ''}. No payment was taken and no product will be shipped.</p><p>${account ? 'Find it again in your profile whenever the mood calls.' : 'Your order receipt is ready below. Create an account to keep a personal fragrance collection for next time.'}</p><div class="confirmation-actions"><button type="button" id="download-receipt" class="button">Download demo receipt ${E.icon('arrow')}</button><a class="button secondary" href="${account ? 'profile.html#orders' : 'account.html#signup'}">${account ? 'My demo orders' : 'Create my collection'} ${E.icon('arrow')}</a><a class="text-link" href="perfumes.html">Keep exploring ${E.icon('arrow')}</a></div></section>`;
      document.getElementById('download-receipt').addEventListener('click', () => {
        const text = ['ESSENCE · DEMO ORDER RECEIPT', order.id, new Date(order.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Almaty' }) + ' (UTC+5)', '', ...order.items.map(line => `${E.product(line.id).name} | ${line.ml} ml | ${line.quantity} × ${E.money(line.price)}`), '', `Fragrances: ${E.money(order.subtotal)}`, `Discount: ${E.money(order.discount)}${order.promo ? ` (${order.promo})` : ''}`, `Demo delivery: ${E.money(order.delivery)}`, `TOTAL: ${E.money(order.total)}`, '', 'Academic simulation. No payment was taken. No product will be shipped.'].join('\n');
        const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
        const link = document.createElement('a'); link.href = url; link.download = `${order.id}-demo-receipt.txt`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
      });
      document.querySelector('.bag-intro h1').innerHTML = 'A lovely <em>discovery.</em>';
      success.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } catch (error) { E.status(form, error.message, true); complete = false; button.disabled = false; }
  });
  render();
})();
