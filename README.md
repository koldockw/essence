# ESSENCE · The Fragrance Edit

A complete responsive fragrance concept store for the Web Technologies final project.

**Manyakina Yuliya · Bazarbayev Bakdaulet · SE-2509 · Astana IT University**

- **Live website:** https://koldockw.github.io/essence/
- **Repository:** https://github.com/koldockw/essence
- **Deadline:** 18 November 2026, 23:59.

## Run

Open `index.html`, or serve this folder for the most consistent browser behaviour:

```sh
python -m http.server 8000
```

Then open http://localhost:8000. Windows can use `py -m http.server 8000`.
No installation, API key, framework or backend is required. Internet access is needed only for live weather.

Optional Node 18+ commands, with no dependency installation:

```sh
npm test
npm run build
```

`build` creates `dist/`. GitHub Pages can serve the root of `main` directly.

## Ten connected pages

| Page | Purpose |
| --- | --- |
| `index.html` | Editorial home, selected fragrances, weather, newsletter, welcome offer |
| `perfumes.html` | Live search, family/gender/budget filters, sorting and saved fragrances |
| `product.html?id=jazz-club` | Product details, note story, real available volumes and price selection |
| `discover.html` | Three-step scent finder, saved recommendations, weather and note/size guide |
| `offers.html` | Three usable, copyable promo codes and clear terms |
| `about.html` | Brand concept, project purpose and the original team |
| `contact.html` | Validated local contact form and functional FAQ accordions |
| `account.html` | Signup and login with inline validation |
| `profile.html` | Protected profile, saved collection, demo orders, editable details, password change |
| `cart.html` | Variant-specific bag, quantity controls, promos, demo checkout and downloadable receipt |

`contanct.html` redirects old assignment links to `contact.html`.

## Working offers

| Code | Effect | Conditions |
| --- | --- | --- |
| `WELCOME10` | 10% off fragrance subtotal | First demo order for the active browser account; no minimum |
| `ESSENCE15` | 15% off fragrance subtotal | Subtotal of at least 75,000 KZT |
| `FREESHIP` | Removes the 2,000 KZT demo delivery fee | Orders with a subtotal below 80,000 KZT |

Codes ignore case and surrounding spaces. One code per order. Delivery is automatically free at a subtotal of 80,000 KZT before discounts. A code is revalidated whenever the bag changes. An ineligible code gives no discount. All arithmetic uses integer KZT values; percentage discounts are rounded once.

## Rubric implementation

| Requirement | Implementation |
| --- | --- |
| Responsive layout, 10 points | CSS Grid/Flexbox, desktop/tablet/mobile breakpoints, wrapping controls, mobile navigation |
| Hosting, 5 points | Existing public GitHub Pages site and public repository links above; local self-contained image assets |
| Light/dark mode, 5 points | Shared semantic colour tokens; `essence.theme` in localStorage; early theme setup avoids a flash |
| Design/UX, 20 points | Consistent typography, colour hierarchy, editorial photography, meaningful empty states, product sizes and clear purchase flow |
| Authentication, 25-point JS section | Signup stores name/email/phone and a salted PBKDF2 password hash locally. Login verifies it, stores a seven-day local session and opens the protected profile |
| Validation | Every form has `novalidate`; JavaScript validates applicable fields, email, phone, password complexity and confirmation; visible errors and focus on the first error |
| Search/filtering | Search updates immediately; family, gender, starting-price and favourites filters combine; sort order and filters persist |
| UI effects, 5 points | Button/heart/photo transitions, toast entry, weather spinner, smooth scrolling; reduced-motion support |
| Public API, 10 points | Open-Meteo current weather via `fetch`/`async`/`await`; city choice, loading, timeout, refresh, error state and labelled cached readings |
| Theme cohesion, 10 points | Weather suggests a fragrance direction; scent finder, note guide, saved collection and offers support fragrance discovery |
| Presentation, 5 points | `docs/DEFENSE_GUIDE.md` contains a timed live demonstration and explanations for both team members |
| Code quality, 5 points | Separate HTML, CSS, data and page-specific JS files; no dependencies; shared helpers; comments around security/state and asynchronous behaviour |

## Public API

- Documentation: https://open-meteo.com/en/docs
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Parameters: latitude, longitude, `current=temperature_2m,weather_code`, `timezone=Asia/Almaty`, `forecast_days=1`.
- Predefined cities: Astana, Almaty, Oral and Shymkent. No geolocation permission is requested.
- 12-second timeout; old city requests are aborted. Fresh data is cached for 15 minutes. A failed refresh can show a clearly labelled reading from the last 24 hours. Without one, the page shows an error and keeps Refresh available.
- Data attribution is displayed in the widget. Scent matching is a simple editorial rule, not a claim made by the API.

## Local data and security limits

Accounts are an educational authentication simulation, not production identity. No backend receives credentials. Passwords use Web Crypto PBKDF2/SHA-256, 120,000 iterations, with an individual random salt. Session storage includes a user ID and expiry, never a password. This does not make client-side access control tamper-proof.

Use demo passwords only. Browser storage is device-specific and can be cleared or edited. The profile route checks the local session. The guest bag and saved fragrances move into an account on login; each account then has an isolated collection, bag and order history. Guest orders remain under the guest browser identity.

Main keys:

- `essence.theme`, `essence.users`, `essence.session`
- `essence.cart.<userId>`, `essence.favorites.<userId>`, `essence.orders.<userId>`
- `essence.promo.<userId>`, `essence.quiz.<userId>`, `essence.messages.<userId>`
- `essence.filters`, `essence.subscribers`, `essence.weatherCity`, `essence.weather.<city>`

All forms use JS validation. No `required`, `pattern`, `minlength`, `maxlength`, `min`, `max` or `type="email"` validation attributes are used. User-entered text is escaped before insertion into dynamic HTML. Values read from localStorage are checked for valid products, volumes and quantities. A maximum of 20 bottles per product/size is enforced in JavaScript.

## Product data and image credits

There are six real fragrances, with actual marketed bottle sizes: REPLICA Jazz Club (30/100 ml), Donna Born in Roma (30/50/100 ml), J’adore (30/50/100 ml), Good Girl (30/50/80 ml), Bad Boy (50/100 ml), and BLEU DE CHANEL (50/100/150 ml). Prices in KZT are illustrative project data, not current retail quotations. Fragrance families are simplified browsing categories.

Original brand product sources are linked on each product page and in `js/products.js`. Exact downloaded photograph URLs are recorded in `docs/asset-sources.json`. Photography comes from Space NK, Sephora, Chanel, Perfumes e Companhia and Unsplash, and is used for this educational, non-commercial concept. Brands and product imagery remain the property of their respective owners; no brand affiliation is claimed.

Photographs are embedded as WebP data in self-contained SVG image files. They are real product photographs, not generated illustrations; the wrapper makes the image assets portable and prevents external image links from breaking during a presentation. Product photos represent the fragrance; the exact pictured volume can differ from the selected bottle size. Colour backgrounds and responsive cropping are presentation choices.

## Project structure

```text
index.html, perfumes.html, product.html, discover.html, offers.html
about.html, contact.html, account.html, profile.html, cart.html
css/style.css
js/products.js, common.js, home.js, catalog.js, product.js
js/weather.js, discover.js, auth.js, profile.js, cart.js, contact.js
images/*.svg
docs/DEFENSE_GUIDE.md, QA.md, asset-sources.json
scripts/build.mjs
tests/core.test.cjs
```

Orders, points, subscriptions and contact messages are local simulations. No payment is accepted, no product is shipped, and no email is sent. There are no fabricated customer reviews or stock claims.
