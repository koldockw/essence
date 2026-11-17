'use strict';
/* Public, keyless Open-Meteo API. Caches are labelled; failed requests never invent weather. */
(() => {
  const E = window.Essence;
  const cities = {
    astana: { name: 'Astana', latitude: 51.1694, longitude: 71.4491 },
    almaty: { name: 'Almaty', latitude: 43.2389, longitude: 76.8897 },
    oral: { name: 'Oral', latitude: 51.2278, longitude: 51.3865 },
    shymkent: { name: 'Shymkent', latitude: 42.3417, longitude: 69.5901 }
  };
  function conditions(code) {
    if (code === 0) return 'Clear skies';
    if ([1, 2, 3].includes(code)) return 'Cloudy skies';
    if ([45, 48].includes(code)) return 'Misty outside';
    if (code >= 71 && code <= 77 || [85, 86].includes(code)) return 'Snow in the air';
    if (code >= 95) return 'Thunderstorms';
    if (code >= 51 && code <= 82) return 'Rain in the air';
    return 'Current conditions';
  }
  document.querySelectorAll('[data-weather-widget]').forEach(widget => {
    const select = widget.querySelector('[data-weather-city]');
    const result = widget.querySelector('[data-weather-result]');
    let request;
    let requestId = 0;
    const storedCity = E.storage.get('essence.weatherCity', 'astana');
    select.value = cities[storedCity] ? storedCity : 'astana';
    const valid = entry => entry && Number.isFinite(entry.temperature) && entry.temperature > -90 && entry.temperature < 65 && Number.isFinite(entry.code) && Number.isFinite(entry.savedAt);
    function display(entry, stale = false) {
      const temperature = entry.temperature;
      const family = temperature < 12 ? 'Amber' : temperature > 23 ? 'Fresh' : 'Floral';
      const recommendation = temperature < 12 ? E.product('jazz-club') : temperature > 23 ? E.product('bleu-de-chanel') : E.product('jadore');
      const title = temperature < 12 ? 'A little warmth.' : temperature > 23 ? 'Keep it fresh.' : 'Something luminous.';
      const text = temperature < 12 ? 'Cold air, a warm signature. Explore tobacco, vanilla and soft woods for today’s scent ritual.' : temperature > 23 ? 'A bright, aromatic fragrance is a lovely companion for a warmer day. Try fresh woods and an easy touch.' : 'A gentle day calls for a little light. Explore floral notes and a warm, graceful finish.';
      const time = new Date(entry.savedAt).toLocaleTimeString('en-GB', { timeZone: 'Asia/Almaty', hour: '2-digit', minute: '2-digit' });
      result.innerHTML = `<div class="weather-loaded"><div class="weather-temp-block">${E.icon(temperature < 12 ? 'leaf' : 'sun')}<span class="weather-temperature">${Math.round(temperature)}°C</span><p>${cities[select.value].name} · ${conditions(entry.code)}</p><span class="weather-source">${stale ? 'Saved reading · ' : 'Updated '}${time} (UTC+5)<br>Weather data: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></span></div><div class="weather-suggestion"><h3>${title}</h3><p>${text}</p><a href="product.html?id=${recommendation.id}">Meet ${recommendation.name} ↗</a>${stale ? '<p class="weather-source">Live update unavailable. Refresh to try again.</p>' : ''}</div></div>`;
      result.setAttribute('aria-busy', 'false');
    }
    async function load(force = false) {
      request?.abort();
      const currentRequest = ++requestId;
      const key = `essence.weather.${select.value}`;
      const cached = E.storage.get(key, null);
      if (!force && valid(cached) && Date.now() - cached.savedAt < 15 * 60000) { display(cached); return; }
      result.innerHTML = '<div class="weather-loading"><span class="spinner" aria-hidden="true"></span>Checking today’s weather…</div>';
      result.setAttribute('aria-busy', 'true');
      const controller = new AbortController();
      request = controller;
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const city = cities[select.value];
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.search = new URLSearchParams({ latitude: city.latitude, longitude: city.longitude, current: 'temperature_2m,weather_code', timezone: 'Asia/Almaty', forecast_days: '1' });
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Weather service unavailable');
        const data = await response.json();
        const entry = { temperature: data.current?.temperature_2m, code: data.current?.weather_code, savedAt: Date.now() };
        if (!valid(entry)) throw new Error('Weather data unavailable');
        if (currentRequest !== requestId) return;
        try { E.storage.set(key, entry); } catch { /* Weather remains usable when cache storage is full. */ }
        display(entry);
      } catch {
        if (currentRequest !== requestId) return;
        if (valid(cached) && Date.now() - cached.savedAt < 24 * 3600000) display(cached, true);
        else { result.innerHTML = '<div class="weather-error"><strong>A little cloudy on our side.</strong>We couldn’t load the live weather. You can refresh to try again, or <a href="discover.html#notes" class="small-link">explore fragrance notes</a> while you wait.</div>'; result.setAttribute('aria-busy', 'false'); }
      } finally { clearTimeout(timeout); }
    }
    select.addEventListener('change', () => { try { E.storage.set('essence.weatherCity', select.value); } catch { /* Selection still works without persistence. */ } load(); });
    widget.querySelector('[data-weather-retry]').addEventListener('click', () => load(true));
    load();
  });
})();
