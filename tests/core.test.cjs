/* Behaviour checks for money, persistence, validation and password hashing.
   Built-in Node modules only; no browser or dependency installation is needed. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
function app() {
  const values = new Map();
  const ctx = { console, TextEncoder, crypto: webcrypto, URLSearchParams, Date, setTimeout, clearTimeout,
    CustomEvent: class { constructor(type) { this.type = type; } },
    localStorage: { getItem: k => values.has(k) ? values.get(k) : null, setItem: (k,v) => values.set(k,String(v)), removeItem: k => values.delete(k) },
    document: { documentElement: { dataset: { theme: 'light' } }, getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, dispatchEvent() {} },
    addEventListener() {}, location: { search: '' } };
  ctx.window = ctx; vm.createContext(ctx);
  for (const file of ['products.js','common.js']) vm.runInContext(readFileSync(resolve(__dirname,'../js',file),'utf8'),ctx);
  return { E:ctx.Essence, store:ctx.localStorage, ctx };
}
test('Each selectable bottle size has its own price and survives a storage round trip',()=>{
 const {E}=app(); E.addToCart('good-girl',30); E.addToCart('good-girl',80,2); E.addToCart('good-girl',30);
 assert.equal(E.getCart().length,2); assert.equal(E.getCart()[0].quantity,2); assert.equal(E.subtotal(),220000);
 assert.throws(()=>E.addToCart('good-girl',100));
});
test('Corrupt storage, unknown products and impossible volumes do not reach checkout',()=>{
 const {E,store}=app(); store.setItem('essence.cart.guest','broken JSON'); assert.equal(E.getCart().length,0);
 E.storage.set(E.scoped('cart'),[{id:'missing',ml:50,quantity:1},{id:'good-girl',ml:100,quantity:1},{id:'jazz-club',ml:30,quantity:-1},{id:'jazz-club',ml:30,quantity:1000}]);
 assert.equal(E.getCart().length,1); assert.equal(E.getCart()[0].quantity,20);
});
test('WELCOME10 is case-insensitive and removes exactly 10% before delivery',()=>{
 const {E}=app(); E.addToCart('jazz-club',30); const t=E.totals(E.getCart(),' welcome10 ');
 assert.equal(t.discount,4200); assert.equal(t.delivery,2000); assert.equal(t.total,39800);
});
test('ESSENCE15 enforces its threshold and recalculates when the bag changes',()=>{
 const {E}=app(); E.addToCart('jazz-club',30); assert.equal(E.checkPromo('ESSENCE15').valid,false);
 E.addToCart('jazz-club',100); const t=E.totals(E.getCart(),'ESSENCE15'); assert.equal(t.discount,18150); assert.equal(t.delivery,0); assert.equal(t.total,102850);
 E.saveCart([{id:'jazz-club',ml:30,quantity:1}]); assert.equal(E.totals(E.getCart(),'ESSENCE15').discount,0);
});
test('FREESHIP removes delivery on a smaller order and does not claim extra savings on free delivery',()=>{
 const {E}=app(); E.addToCart('good-girl',30); assert.equal(E.totals(E.getCart(),'FREESHIP').total,39000);
 E.addToCart('good-girl',80); assert.equal(E.checkPromo('FREESHIP').valid,false); assert.equal(E.totals().delivery,0);
});
test('First-order offer stops working after the first saved order',()=>{
 const {E}=app(); E.addToCart('jadore',30); assert.equal(E.checkPromo('WELCOME10').valid,true);
 E.storage.set(E.scoped('orders'),[{id:'ES-DEMO',items:[],total:45200}]); assert.equal(E.checkPromo('WELCOME10').valid,false);
 assert.equal(E.checkPromo('UNKNOWN').valid,false); assert.equal(E.checkPromo('').valid,false);
});
test('Guest bag and favourites migrate on login, accounts stay isolated, session contains no password',()=>{
 const {E,store}=app(); E.addToCart('good-girl',50); E.storage.set(E.scoped('favorites'),['jazz-club']);
 const a={id:'one',name:'Demo One',email:'one@example.test'}; const b={id:'two',name:'Demo Two',email:'two@example.test'};
 E.storage.set('essence.users',[a,b]); E.signIn(a); assert.equal(E.getCart().length,1); assert.equal(E.getFavorites()[0],'jazz-club');
 assert.equal(store.getItem('essence.cart.guest'),null); assert.equal(E.user().id,'one');
 const session=E.storage.get('essence.session',{}); assert.equal(Object.hasOwn(session,'password'),false);
 E.storage.remove('essence.session'); E.signIn(b); assert.equal(E.getCart().length,0); assert.equal(E.getFavorites().length,0);
 E.storage.set('essence.session',{userId:'one',expires:Date.now()-1}); assert.equal(E.user(),null);
});
test('JS validation rejects bad email, weak password, invalid phone and empty fields',()=>{
 const {E}=app(); const v=E.validators;
 assert.equal(v.email('demo@example.test'),''); assert.notEqual(v.email('bad@'),'');
 assert.equal(v.password('Demo-Only-123!'),''); for(const p of ['short','alllowercase12!','ALLUPPERCASE12!','NoNumbers!','NoSymbols123']) assert.notEqual(v.password(p),'');
 assert.equal(v.phone('+7 (707) 123-45-67'),''); assert.equal(v.phone('87071234567'),''); assert.notEqual(v.phone('12345'),''); assert.notEqual(v.phone('+7letters7071234567'),'');
 assert.notEqual(v.required('   '),''); assert.notEqual(v.address('x'),''); assert.notEqual(v.city('Somewhere'),''); assert.notEqual(v.message('Hi'),'');
});
test('PBKDF2 hashes match only the correct password and salt and never store plaintext',async()=>{
 const {E}=app(); const a=await E.hashPassword('Demo-Only-123!','salt-a');
 assert.equal(a.length,64); assert.equal(a,await E.hashPassword('Demo-Only-123!','salt-a'));
 assert.notEqual(a,await E.hashPassword('Wrong-Only-123!','salt-a')); assert.notEqual(a,await E.hashPassword('Demo-Only-123!','salt-b'));
});
test('User-provided text is escaped before entering dynamic HTML',()=>{
 const {E}=app(); assert.equal(E.escape('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
});

function weatherApp(cached) {
 const {E,ctx}=app();
 const city={value:'astana',addEventListener(){}};
 const result={innerHTML:'',attributes:{},setAttribute(k,v){this.attributes[k]=v;}};
 const retry={addEventListener(){}};
 const widget={querySelector(selector){return selector==='[data-weather-city]'?city:selector==='[data-weather-result]'?result:retry;}};
 ctx.document.querySelectorAll=()=>[widget]; ctx.AbortController=AbortController; ctx.URL=URL;
 ctx.fetch=async()=>{throw new Error('Network unavailable');};
 if(cached)E.storage.set('essence.weather.astana',cached);
 vm.runInContext(readFileSync(resolve(__dirname,'../js/weather.js'),'utf8'),ctx);
 return {result};
}
test('Failed weather request keeps the loading and error states honest',async()=>{
 const {result}=weatherApp(); assert.match(result.innerHTML,/Checking today/);
 await new Promise(resolve=>setImmediate(resolve)); assert.match(result.innerHTML,/couldn’t load/);
 assert.equal(result.attributes['aria-busy'],'false'); assert.doesNotMatch(result.innerHTML,/°C/);
});
test('A failed refresh can show a clearly labelled recent weather reading',async()=>{
 const {result}=weatherApp({temperature:5,code:3,savedAt:Date.now()-3600000});
 await new Promise(resolve=>setImmediate(resolve)); assert.match(result.innerHTML,/Saved reading/);
 assert.match(result.innerHTML,/Live update unavailable/); assert.match(result.innerHTML,/5°C/);
});
