'use strict';
(() => {
  const E = window.Essence;
  const steps = [
    { title: 'What feels most like you?', description: 'Choose a scent direction. Follow your first instinct.', options: [{ value: 'Fresh', title: 'Fresh & clean', text: 'Bright mornings. Open windows.' }, { value: 'Floral', title: 'Soft & floral', text: 'A little light. A beautiful bouquet.' }, { value: 'Woody', title: 'Warm & woody', text: 'Quiet depth. A slower pace.' }, { value: 'Amber', title: 'Rich & spicy', text: 'A little mystery. An impression.' }] },
    { title: 'When will you wear it?', description: 'Think of the moment you want to make your own.', options: [{ value: 'everyday', title: 'The everyday', text: 'A signature for my own little rituals.' }, { value: 'evening', title: 'After hours', text: 'Something for an unforgettable night.' }, { value: 'gift', title: 'A thoughtful gift', text: 'A little something for someone special.' }] },
    { title: 'How do you want to arrive?', description: 'Both choices can be beautiful. Choose what you enjoy.', options: [{ value: 'soft', title: 'Quietly', text: 'Soft, personal and close to me.' }, { value: 'bold', title: 'With presence', text: 'Expressive, confident and memorable.' }] }
  ];
  const saved = E.storage.get(E.scoped('quiz'), null);
  const answers = saved && Array.isArray(saved.answers) && saved.answers.length === 3 ? saved.answers.map((answer, i) => steps[i].options.some(o => o.value === answer) ? answer : '') : ['', '', ''];
  let step = 0;
  const body = document.getElementById('quiz-body');
  const next = document.getElementById('quiz-next');
  const back = document.getElementById('quiz-back');
  function render() {
    body.innerHTML = `<h2>${steps[step].title}</h2><p class="quiz-intro">${steps[step].description}</p><div class="quiz-options" role="group" aria-label="${steps[step].title}">${steps[step].options.map(o => `<button type="button" class="quiz-option" data-quiz-value="${o.value}" aria-pressed="${answers[step] === o.value}"><strong>${o.title}</strong><small>${o.text}</small></button>`).join('')}</div>`;
    back.hidden = step === 0;
    next.innerHTML = `${step === 2 ? 'Find my scents' : 'Next'} ${E.icon('arrow')}`;
    document.getElementById('quiz-error').textContent = '';
    document.querySelectorAll('.quiz-progress>span').forEach((el, i) => { el.classList.toggle('active', i <= step); if (i === step) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
  }
  function showResults(scroll = true) {
    const ranked = E.products.map(p => ({ p, score: (p.family === answers[0] ? 6 : 0) + (p.occasion.includes(answers[1]) ? 2 : 0) + (p.strength === answers[2] ? 1 : 0) })).sort((a, b) => b.score - a.score).slice(0, 3).map(item => item.p);
    const result = document.getElementById('quiz-results');
    result.hidden = false;
    result.innerHTML = `<div class="quiz-result-header"><div><span class="eyebrow">A STARTING POINT, JUST FOR YOU</span><h2>Your kind of <em>${answers[0].toLowerCase()}.</em></h2><p>${steps[1].options.find(o => o.value === answers[1]).title}, ${answers[2] === 'soft' ? 'with a softer presence' : 'with a little more presence'}. Here are three directions to explore. Your choices are saved for next time.</p></div><button type="button" class="text-link" id="quiz-restart">Try a different feeling ${E.icon('arrow')}</button></div><div id="quiz-product-results" class="product-grid quiz-result-grid"></div>`;
    E.renderCards(document.getElementById('quiz-product-results'), ranked);
    if (scroll) result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }
  body.addEventListener('click', e => {
    const button = e.target.closest('[data-quiz-value]'); if (!button) return;
    answers[step] = button.dataset.quizValue;
    body.querySelectorAll('[data-quiz-value]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.getElementById('quiz-error').textContent = '';
  });
  next.addEventListener('click', () => {
    if (!answers[step]) { document.getElementById('quiz-error').textContent = 'Choose the feeling that speaks to you.'; body.querySelector('button').focus(); return; }
    if (step < 2) { step++; render(); body.querySelector('button').focus(); }
    else {
      try { E.storage.set(E.scoped('quiz'), { answers: [...answers], savedAt: Date.now() }); showResults(); }
      catch (error) { document.getElementById('quiz-error').textContent = error.message; }
    }
  });
  back.addEventListener('click', () => { if (step > 0) { step--; render(); body.querySelector('button').focus(); } });
  document.addEventListener('click', e => { if (e.target.closest('#quiz-restart')) { step = 0; answers.fill(''); document.getElementById('quiz-results').hidden = true; render(); document.querySelector('.quiz-panel').scrollIntoView({ block: 'center', behavior: 'smooth' }); } });
  render();
  if (answers.every(Boolean)) showResults(false);
})();
