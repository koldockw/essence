# ESSENCE: защита проекта

Команда: **Manyakina Yuliya, Bazarbayev Bakdaulet, SE-2509**.

Сайт: https://koldockw.github.io/essence/
Код: https://github.com/koldockw/essence

## Перед защитой

1. Открой сайт в обычном окне браузера. Проверь интернет для погодного API.
2. Подготовь DevTools: Application → Local storage. Не очищай данные после создания аккаунта, если собираешься показывать сохранение.
3. Подготовь выдуманные данные, например Demo Student, demo.student@example.test, +7 707 123 45 67. Используй отдельный учебный пароль, который соответствует подсказке.
4. Уменьши масштаб страницы только если проектор требует; для показа адаптивности используй режим устройств DevTools.
5. Открой README и файлы JS во второй вкладке. Сначала показывай работу сайта, потом код.

## Демонстрация примерно на 7 минут

| Время | Кто | Что сделать и сказать |
| --- | --- | --- |
| 0:00–0:40 | Юлия | Главная: тема, аудитория, меню. “Our project is ESSENCE, a fragrance concept store. It helps people choose a perfume by notes, mood and bottle size.” |
| 0:40–1:20 | Юлия | Показать каталог и товар. Выбрать объём, увидеть новую цену. “We use real product photos and real bottle sizes. Prices in tenge are demo data.” |
| 1:20–1:55 | Юлия | Переключить тёмную тему, перейти на другую страницу, затем показать мобильное меню. “The selected theme is saved in localStorage and stays the same on every page. CSS Grid, Flexbox and media queries make the layout responsive.” |
| 1:55–2:50 | Бакдаулет | Открыть Create account. Отправить пустую форму, показать ошибки. Затем зарегистрироваться с учебными данными. “All validation is written in JavaScript. Every form uses novalidate. The password needs uppercase and lowercase letters, a number and a symbol.” |
| 2:50–3:25 | Бакдаулет | Профиль, выход, повторный вход. “The account is stored locally. We hash the password with PBKDF2 and compare the hash during login. The session contains a user ID and an expiry time.” |
| 3:25–4:10 | Бакдаулет | В каталоге найти vanilla, поменять семейство, показать пустое состояние и Reset. Сохранить аромат сердцем, проверить профиль. “Search and filters update the product list immediately. Saved fragrances and filter choices remain after reload.” |
| 4:10–5:10 | Юлия | Offers → скопировать WELCOME10. Добавить Jazz Club 30 ml в корзину. Применить код. Цена 42 000, скидка 4 200, доставка 2 000, итого 39 800 ₸. “The code is copied to the clipboard. The bag checks the conditions and calculates the real demo discount.” |
| 5:10–5:55 | Бакдаулет | Заполнить демо-оформление примерным адресом. Завершить, скачать чек, показать заказ в профиле. “This is a simulated checkout. We do not collect payment details or ship products. The order is saved in the active account.” |
| 5:55–6:35 | Бакдаулет | Find your scent: пройти три шага. Показать погодный блок, сменить город и Refresh. “We call Open-Meteo with fetch and async/await. The page shows loading, handles failures and suggests a fragrance direction from the temperature.” |
| 6:35–7:00 | Юлия | Контакты и FAQ, файлы проекта, ссылки на сайт и код. “Each feature supports the same purpose: discovering a fragrance and keeping a personal collection. We have ten connected pages.” |

Подстройте длительность под лимит преподавателя. Если времени мало, оставьте регистрацию, поиск, промокод и API.

## Где искать код

| Функция | Файл | Ключевой элемент |
| --- | --- | --- |
| Данные товаров, объёмы, цены | `js/products.js` | `ESSENCE_PRODUCTS`, `sizes`, `notes` |
| Общие функции и localStorage | `js/common.js` | `storage`, `scoped`, `getCart`, `getFavorites` |
| Регистрация и вход | `js/auth.js` | submit signup/login, `hashPassword`, `signIn` |
| Сложность пароля, email, телефон | `js/common.js` | `validators`, `validate`, `setError` |
| Профиль и история заказов | `js/profile.js` | `fillDetails`, `renderOrders`, `showTab` |
| Поиск и фильтры | `js/catalog.js` | `state`, `render` |
| Выбор объёма товара | `js/product.js` | `data-detail-size`, обновление `detail-price` |
| Корзина и промокоды | `js/cart.js`, `js/common.js` | `render`, `checkPromo`, `totals` |
| Погодный API | `js/weather.js` | `load`, `fetch`, `AbortController`, `display` |
| Подбор аромата | `js/discover.js` | `steps`, `answers`, `showResults` |
| Светлая и тёмная темы | `css/style.css`, `js/common.js` | CSS variables, `applyTheme` |
| Адаптивность | `css/style.css` | Grid/Flexbox, media queries 1150/900/700/370 px |
| Контактная форма | `js/contact.js` | `validate`, сохранение сообщения |

## Короткие ответы на вопросы

**Почему localStorage?**
The assignment does not require a backend. localStorage keeps the demo data after page reload and between pages on the same origin.

**Почему пароль не виден в localStorage?**
We store a salted password hash instead of the plain password. During login, we hash the entered value with the same salt and compare the results.

**Это безопасная настоящая авторизация?**
No. This is a frontend simulation. Users can change local browser data. A real store needs a backend and server-side authentication.

**Что такое salt?**
A random value added to the password-hashing process. Two accounts with the same password get different stored hashes.

**Как открывается профиль?**
Login saves the session and redirects to profile.html. The profile script checks the session. Without it, the page redirects to the login form.

**Как работает API?**
The browser sends the selected city coordinates to Open-Meteo. We read current temperature and weather code from JSON, then update the weather card and the recommendation.

**Что если API не работает?**
The request times out after twelve seconds. We show a labelled recent saved reading if one exists. Otherwise we show an error and a Refresh button. The catalogue still works.

**Почему нет required и type=email?**
The task asks us to validate in JavaScript. We use novalidate and show our own error messages next to the fields.

**Что сохраняется после обновления?**
Theme, accounts, session, cart, favourites, demo orders, quiz choices, filters, subscription and weather cache. Data stays in the current browser.

**Зачем клиенту возвращаться?**
Their saved collection, scent direction, order history and bag are still there. They can reorder a favourite, explore a new mood or use another offer.

**Как считается скидка?**
We calculate the fragrance subtotal, validate one promo code, subtract its discount and add delivery. Delivery thresholds use the subtotal before discounts.

**Почему цены не с API?**
Prices are stable demo data for the project. Weather is the live integration. We do not claim that these are actual current retail prices.

**Как работает подбор аромата?**
It gives points for the selected family, occasion and desired presence. Products are sorted by score. This is a transparent rule-based recommendation, not an AI model.

**Почему фотографии в SVG?**
The SVG contains the downloaded photograph as embedded WebP data. The photos are real. The wrapper lets the text-based repository upload keep every image self-contained.
