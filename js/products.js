'use strict';
/* Real bottle sizes and fragrance notes; prices are illustrative KZT demo prices. */
window.ESSENCE_PRODUCTS = [
  {
    id: 'jazz-club', brand: 'Maison Margiela', name: 'REPLICA Jazz Club', type: 'Eau de Toilette', gender: 'Unisex', family: 'Woody', mood: 'Warm & intimate',
    notes: ['Pink pepper', 'Rum', 'Tobacco', 'Vanilla'], top: 'Pink pepper, neroli, lemon', heart: 'Rum, clary sage, vetiver', base: 'Tobacco leaf, vanilla, styrax',
    description: 'The soft glow of a late-night jazz bar, bottled. Rum and tobacco settle into a warm vanilla finish. A beautiful companion for slow evenings and colder days.',
    sizes: [{ ml: 30, price: 42000 }, { ml: 100, price: 79000 }], image: 'images/jazz-club.svg', label: 'THE EVENING EDIT', occasion: ['evening', 'everyday'], strength: 'soft',
    source: 'https://www.maisonmargiela-fragrances.us/fragrances/replica-eau-de-toilette/replica-jazz-club/MM008.html'
  },
  {
    id: 'born-in-roma', brand: 'Valentino', name: 'Donna Born in Roma', type: 'Eau de Parfum', gender: 'Women', family: 'Floral', mood: 'Modern & expressive',
    notes: ['Blackcurrant', 'Jasmine', 'Bourbon vanilla'], top: 'Blackcurrant, bergamot', heart: 'Jasmine grandiflorum, jasmine sambac', base: 'Bourbon vanilla, cashmeran, guaiac wood',
    description: 'A bright floral opening with a beautifully warm vanilla base. Rome-inspired confidence in a distinctive studded bottle, made for days that become nights.',
    sizes: [{ ml: 30, price: 45000 }, { ml: 50, price: 62000 }, { ml: 100, price: 88000 }], image: 'images/born-in-roma.svg', label: 'A MODERN CLASSIC', occasion: ['everyday', 'evening', 'gift'], strength: 'bold',
    source: 'https://www.valentino-beauty.us/fragrances/fragrances-women/fragrances-women-born-in-roma/born-in-roma-donna-eau-de-parfum-MPL00468.html'
  },
  {
    id: 'jadore', brand: 'Dior', name: 'J’adore', type: 'Eau de Parfum', gender: 'Women', family: 'Floral', mood: 'Radiant & graceful',
    notes: ['Ylang-ylang', 'Damascus rose', 'Jasmine'], top: 'Ylang-ylang', heart: 'Damascus rose', base: 'Jasmine grandiflorum, jasmine sambac',
    description: 'A luminous bouquet that brings ylang-ylang, rose and jasmine together. Elegant without trying too hard, with a golden warmth that feels like a little sunshine.',
    sizes: [{ ml: 30, price: 48000 }, { ml: 50, price: 65000 }, { ml: 100, price: 92000 }], image: 'images/jadore.svg', label: 'THE FLORAL EDIT', occasion: ['everyday', 'gift'], strength: 'soft',
    source: 'https://www.dior.com/en_int/beauty/products/j%E2%80%99adore-eau-de-parfum-Y0998031.html'
  },
  {
    id: 'good-girl', brand: 'Carolina Herrera', name: 'Good Girl', type: 'Eau de Parfum', gender: 'Women', family: 'Amber', mood: 'Confident & magnetic',
    notes: ['Almond', 'Jasmine', 'Tuberose', 'Tonka'], top: 'Almond', heart: 'Jasmine sambac, tuberose', base: 'Tonka bean, cocoa',
    description: 'Creamy white florals meet the depth of tonka and cocoa. A striking evening scent in the unmistakable stiletto bottle. Wear it when you want to leave an impression.',
    sizes: [{ ml: 30, price: 39000 }, { ml: 50, price: 54000 }, { ml: 80, price: 71000 }], image: 'images/good-girl.svg', label: 'AFTER HOURS', occasion: ['evening', 'gift'], strength: 'bold',
    source: 'https://www.carolinaherrera.com/uk/en/p-fragrance/good-girl-eau-de-parfum?sku=000000000065182262'
  },
  {
    id: 'bad-boy', brand: 'Carolina Herrera', name: 'Bad Boy', type: 'Eau de Toilette', gender: 'Men', family: 'Amber', mood: 'Spicy & unmistakable',
    notes: ['Bergamot', 'Black pepper', 'Cedar', 'Tonka'], top: 'Bergamot, black and white pepper', heart: 'Cedarwood, sage', base: 'Tonka bean, cocoa',
    description: 'A lively hit of bergamot and pepper gives way to warm woods and tonka. Contrast and character, captured in a sculptural lightning-bolt bottle.',
    sizes: [{ ml: 50, price: 44000 }, { ml: 100, price: 65000 }], image: 'images/bad-boy.svg', label: 'MAKE AN ENTRANCE', occasion: ['evening', 'everyday'], strength: 'bold',
    source: 'https://www.carolinaherrera.com/ww/en/p-fragrance/bad-boy?sku=000000000065206727'
  },
  {
    id: 'bleu-de-chanel', brand: 'Chanel', name: 'BLEU DE CHANEL', type: 'Eau de Parfum', gender: 'Men', family: 'Fresh', mood: 'Clean & quietly confident',
    notes: ['Aromatic notes', 'Cedar', 'Sandalwood'], top: 'Aromatic freshness', heart: 'Ambery cedar', base: 'Sandalwood, musky woods',
    description: 'A polished aromatic-woody signature. Ambery cedar and sandalwood bring depth to its fresh character, making it an effortless choice for work, weekends and everything between.',
    sizes: [{ ml: 50, price: 61000 }, { ml: 100, price: 89000 }, { ml: 150, price: 114000 }], image: 'images/bleu-de-chanel.svg', label: 'YOUR EVERYDAY SIGNATURE', occasion: ['everyday', 'gift'], strength: 'soft',
    source: 'https://www.chanel.com/gr/fragrance/p/107360/bleu-de-chanel-eau-de-parfum-spray/'
  }
];
