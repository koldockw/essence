# ESSENCE: защита на 4:45

Manyakina Yuliya, Bazarbayev Bakdaulet. Группа SE-2509, Astana IT University.

Сайт: https://koldockw.github.io/essence/
Код: https://github.com/koldockw/essence

Обновлённый лимит: максимум 5 минут. Цель: 4:45. За каждые лишние 30 секунд снимают 2 балла. Не используйте старый сценарий на 7 минут. PPTX в требованиях не указан: показывайте готовый сайт в браузере. Код во время защиты не редактируйте.

## Подготовка

1. Откройте главную страницу, каталог, аккаунт и Find your scent в отдельных вкладках. Проверьте интернет.
2. Зарегистрируйте отдельный учебный аккаунт для репетиции. Для самой защиты подготовьте другой уникальный email, чтобы показать новую регистрацию без ошибки дубликата. Не используйте настоящие пароли.
3. Во вкладке регистрации заранее заполните имя, email, пароль и подтверждение. В телефон временно введите 123, чтобы на защите показать ошибку, затем замените на корректный пример +7 707 123 45 67. Такая подготовка формы не требует изменения кода.
4. Корзина для демонстрации: Jazz Club 30 ml. Перед первым показом WELCOME10 у этого аккаунта не должно быть завершённых заказов. Если код уже использован, покажите ESSENCE15 с товаром на 75 000 ₸ или больше.
5. Резервные изображения лежат в папке backup_screenshots внутри итогового ZIP. При сбое интернета показывайте их и честно говорите, что это заранее сделанные скриншоты.
6. Отрепетируйте вместе минимум два раза с секундомером. Не пытайтесь объяснять каждую функцию. Оставьте 15 секунд до лимита.

## Порядок показа и текст B1

| Время | Кто | Действия и реплики |
| --- | --- | --- |
| 0:00-0:30 | Юлия, затем Бакдаулет | Юлия: “Hello. I am Manyakina Yuliya.” Бакдаулет: “I am Bazarbayev Bakdaulet. We are from group SE-2509.” Юлия: “Our project is ESSENCE, a fragrance concept store. Our goal is to help people choose a perfume by notes, mood and bottle size. Our target users want a personal and simple shopping experience.” |
| 0:30-1:10 | Юлия | Главная, desktop/tablet/mobile в DevTools, мобильное меню, тёмная тема и переход в каталог. “Our design uses warm neutral colours, green accents and real product photos. Grid, Flexbox and media queries adapt the layout. The theme is saved in localStorage and stays the same on every page.” Покажите hover кнопки и карточки. |
| 1:10-2:00 | Бакдаулет | Подготовленная регистрация: отправить, показать ошибку телефона, исправить, создать аккаунт и открыть профиль. Если укладываетесь, выйти и войти ещё раз. “Validation is written in JavaScript. Forms use novalidate. We check required fields, email, phone and password complexity. The account is stored locally. Passwords are saved as salted PBKDF2 hashes. The profile shows the saved user details.” |
| 2:00-2:40 | Бакдаулет | Каталог: поиск vanilla, Reset, семейство, сердце, объём 30/100 ml. “Search and filters update immediately. We can save a fragrance, choose a real bottle size and see its price. The bag and saved collection remain after reload.” |
| 2:40-3:20 | Юлия | Offers: скопировать WELCOME10, корзина с Jazz Club 30 ml, применить код. “Promo codes are copied to the clipboard and checked in the bag. The fragrance costs 42,000 tenge. The discount is 4,200 and demo delivery is 2,000. The total is 39,800 tenge. Checkout is a simulation and does not take money.” Не тратьте время на ввод полного адреса: оформление показано в отчёте. |
| 3:20-4:10 | Бакдаулет | Find your scent: три выбора, результат. Погодный блок: сменить город, показать загрузку и рекомендацию. “The scent finder saves our choices. We also call the public Open-Meteo API with fetch and async/await. It returns temperature and a weather code. We use temperature for a fragrance suggestion. We show loading, a retry button and an error message if the request fails.” |
| 4:10-4:30 | Юлия | Контакты, FAQ и профиль с избранным. “The pages are connected and each feature supports fragrance discovery. A visitor can return to a saved collection, an order or a previous scent-finder result.” |
| 4:30-4:45 | Юлия | “Our strengths are a complete discovery flow, a consistent design and working local features. In the future, we would add a backend, synchronised accounts and real shop inventory. Thank you for your attention.” |

## Если остаётся мало времени

После 4:10 сразу переходите к заключению. К 4:45 завершите основные слова. Вопросы преподавателя слушайте после заключения. Не добавляйте новые функции в показ в последний момент.

## Где находится код

| Возможность | Файл и функция |
| --- | --- |
| Товары, реальные объёмы, демо-цены | js/products.js, ESSENCE_PRODUCTS |
| localStorage, валидация, пароли | js/common.js: storage, validate, validators, hashPassword |
| Регистрация и вход | js/auth.js: обработчики submit |
| Профиль и заказы | js/profile.js: fillDetails, renderOrders |
| Поиск и фильтры | js/catalog.js: state, render |
| Объём и цена | js/product.js: data-detail-size |
| Промокоды и суммы | js/common.js: checkPromo, totals; js/cart.js |
| API, загрузка и ошибки | js/weather.js: load, display |
| Подбор аромата | js/discover.js: steps, showResults |
| Адаптивность и темы | css/style.css: переменные и media queries |

## Короткие ответы

- **Why localStorage?** The assignment has no backend. It keeps data after reload on the same browser and origin.
- **Why a hash?** We compare password hashes and avoid saving the plain password. A salt makes hashes different between accounts.
- **Is this real authentication?** It is a frontend simulation. Production authentication needs a backend.
- **How does the API fit the topic?** Temperature selects a warm, fresh or floral fragrance direction. This is a simple editorial rule.
- **What if the API fails?** We show a recent labelled saved reading or an error with Refresh. We do not invent weather.
- **What makes a visitor return?** A saved bag, favourites, scent-finder choices, demo history and working offers.
- **What must each student submit?** The ZIP, PDF report and TXT links file together in Moodle, in the FINAL EXAM FOLDER.
