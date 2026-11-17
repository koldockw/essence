# Verification record

Date: 17 November 2026. Tests use invented demo data only.

## Automated checks

`npm test`: 19/19 checks passed in the updated audit. The original twelve checks remain in place, with seven additional regression and site-contract checks. The checks cover independent bottle variants, subtotal arithmetic, corrupt storage, quantity limits, all three coupon rules, threshold recalculation, first-order eligibility, guest migration, account isolation, session expiry, email/phone/password validation, PBKDF2 password matching, HTML escaping, API failure and a labelled stale-weather fallback.

Every JavaScript file passed `node --check`. All real HTML forms include `novalidate`. A source scan found no forbidden HTML validation attributes, duplicate IDs or broken local page/script/style links. Product image paths were checked against the actual image folder.

## Browser checks

The site was exercised in Chrome using an internal static preview:

- Empty signup form displayed separate inline errors for name, email, phone, password and confirmation.
- A synthetic account was created; profile showed its name and email.
- Logout returned to login. An incorrect password displayed an on-page error. The correct password opened the profile with its saved favourite and order history intact.
- Searching for `jasmine` returned three fragrances immediately. Clearing search restored the full collection.
- Choosing Jazz Club 100 ml changed the add action and saved the correct variant to the bag.
- The J’adore favourite persisted into the profile and across login.
- WELCOME10 copied to the browser clipboard; the clipboard contained exactly `WELCOME10`.
- ESSENCE15 recalculated correctly when removing another product: Jazz Club 100 ml, subtotal 79,000 KZT, discount 11,850 KZT, delivery 2,000 KZT, total 69,150 KZT.
- Empty checkout address displayed an inline error. A synthetic complete checkout created a demo order, cleared the bag, downloaded a receipt and appeared in profile history.
- Switching to dark mode and navigating to the catalogue preserved the theme. Both modes were visually inspected.
- The complete three-step scent finder returned ranked products and saved its choices.
- Live Open-Meteo data loaded for Astana with the current temperature, condition, update time, attribution and a matching fragrance suggestion. Error and stale-cache paths are covered by automated checks.
- At the 1363 px desktop viewport, the page did not overflow horizontally and all photographs loaded.
- Real same-origin frame viewports of 390 px and 768 px were visually checked. Neither home nor the catalogue overflowed horizontally.
- All ten route entry points were loaded in 320 px frames. The document scroll width matched the available 305 px content viewport (the remaining space was the vertical scrollbar); no image load errors were found. Protected/authentication routes respond to the current session.

The temporary responsive QA pages are excluded from the final build.

## Scope

This is an educational browser-local simulation. It does not test a backend, real email delivery, payment processing or shipping because those are not part of the implementation. Local source checks do not guarantee third-party APIs or brand pages will remain available forever. Photos used in the storefront are local embedded assets.

Publication verification is completed against the final GitHub Pages deployment separately.


## Updated PDF-guideline audit, 17 November 2026

The supplied presentation PDF adds three separate Moodle files, exact file naming, an individual submission requirement, screenshot/video backup and a strict five-minute presentation. The original seven-minute guide and ZIP-only delivery were insufficient for these additional submission conditions. The defense guide now targets 4:45; a separate PDF report and TXT links file are delivered under the required ESSENCE_SE2509 names. Both students must upload all three files individually.

The code recheck added seven contract/regression checks, for a total of 19 passing tests. Light-theme muted text changed from #72756d to #60665d: its contrast on the sage surface increased from about 3.81:1 to 4.80:1. Main and muted text tokens now exceed 4.5:1 on all five tested light/dark surfaces. This token check is not a claim that every photographic overlay is WCAG-certified.

Inline errors now clear using aria-describedby, including newsletter and promo fields. A guest scent-finder result moves into the account on login, while a newer account result is preserved. No authentication backend or real purchase processing has been introduced.
