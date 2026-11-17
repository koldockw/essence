'use strict';
(() => {
  const E = window.Essence;
  const form = document.getElementById('contact-form');
  const account = E.user();
  if (account) ['name', 'email', 'phone'].forEach(key => { form.elements[key].value = account[key] || ''; });
  form.addEventListener('submit', e => {
    e.preventDefault(); E.status(form, '');
    if (!E.validate(form, { name: 'name', email: 'email', phone: 'phone', message: 'message' })) return;
    try {
      const data = Object.fromEntries(new FormData(form));
      const saved = E.storage.get(E.scoped('messages'), []);
      const messages = Array.isArray(saved) ? saved : [];
      const ticket = `NOTE-${Date.now().toString(36).slice(-6).toUpperCase()}`;
      E.storage.set(E.scoped('messages'), [...messages, { ...data, id: ticket, createdAt: new Date().toISOString() }]);
      form.reset(); E.status(form, `Your message is saved as ${ticket}. Thank you for sharing it. This demo does not send email.`);
    } catch (error) { E.status(form, error.message, true); }
  });
})();
