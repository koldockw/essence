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

Английские реплики ниже: примерно 214 слов. Остальное время отведено на действия в браузере и короткие паузы.

## Порядок показа и текст B1

| Время | Кто | Действия и реплики |
| --- | --- | --- |
| 0:00-0:30 | Юлия, затем Бакдаулет | Юлия: “Hello. I am Manyakina Yuliya.” Бакдаулет: “I am Bazarbayev Bakdaulet, from SE-2509.” Юлия: “ESSENCE is a perfume concept store. We help people find fragrances by notes, mood and bottle size. Our users want simple, personal shopping.” |
| 0:30-1:10 | Юлия | Главная, desktop/tablet/mobile в DevTools, мобильное меню, тёмная тема и переход в каталог. “We use real photos, neutral colours and green accents. Grid, Flexbox and media queries adapt the layout. Both themes stay consistent between pages through localStorage.” Покажите hover кнопки. |
| 1:10-2:00 | Бакдаулет | Подготовленная регистрация: отправить, показать ошибку телефона, исправить, создать аккаунт и открыть профиль. Если успеваете, выйти и войти ещё раз. “JavaScript checks the fields and shows inline errors. We use novalidate. Registration saves the account locally. Passwords use salted hashes. Login opens a profile with saved user details.” |
| 2:00-2:40 | Бакдаулет | Поиск vanilla, Reset, фильтр, сердце и объём 30/100 ml. “Search and filters update immediately. A heart saves a fragrance. Different bottle sizes have different prices. The bag and favourites stay after reload.” |
| 2:40-3:20 | Юлия | Offers: скопировать WELCOME10, открыть подготовленную корзину с Jazz Club 30 ml и применить код. “Copy a code, then apply it in the bag. WELCOME10 gives ten percent off the first demo order. The total updates immediately. No real payment is taken.” На экране: 42 000 - 4 200 + 2 000 = 39 800 ₸. Полный адрес не вводите: оформление показано в отчёте. |
| 3:20-4:10 | Бакдаулет | Find your scent: три выбора и результат. Погодный блок: сменить город и показать загрузку/рекомендацию. “The scent finder saves our choices. Open-Meteo returns live temperature and a weather code. We use them for a scent suggestion. Loading, errors and retry are handled, so the page stays useful if the request fails.” |
| 4:10-4:30 | Юлия | Контакты, FAQ и сохранённая коллекция. “The pages work together. Visitors can return to a saved collection, a previous choice or their demo order history.” |
| 4:30-4:45 | Юлия | “Our strengths are personal discovery and consistent design. Next, we would add a backend and real inventory. Thank you for your attention.” |

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
