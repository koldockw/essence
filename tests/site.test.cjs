const {test}=require('node:test');const assert=require('node:assert/strict');
const {readFileSync,existsSync,readdirSync}=require('node:fs');const {resolve}=require('node:path');const vm=require('node:vm');
const root=resolve(__dirname,'..');const read=f=>readFileSync(resolve(root,f),'utf8');const pages=readdirSync(root).filter(f=>f.endsWith('.html'));
test('Forms use novalidate and no forbidden browser validation attributes',()=>{
 let count=0;for(const f of pages){const s=read(f);for(const tag of s.match(/<form\b[^>]*>/gi)||[]){count++;assert.match(tag,/\bnovalidate(?:\s|=|>)/i,f);}
 for(const tag of s.match(/<(?:input|select|textarea|form)\b[^>]*>/gi)||[]){assert.doesNotMatch(tag,/\s(?:required|pattern|minlength|maxlength|min|max)(?=\s|=|>)/i,f);assert.doesNotMatch(tag,/\btype\s*=\s*["']email["']/i,f);}}
 assert.ok(count>=7);
});
test('Pages have unique IDs, working local links and connected navigation',()=>{
 for(const f of pages){const s=read(f);const ids=[...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,f);
 for(const m of s.matchAll(/\b(?:src|href)="([^"]+)"/g)){if(/^(?:https?:|data:|mailto:|#)/.test(m[1]))continue;const target=m[1].split(/[?#]/)[0];if(target)assert.ok(existsSync(resolve(root,target)),f+': '+target);}
 if(f!=='contanct.html')for(const target of ['index.html','perfumes.html','discover.html','offers.html','about.html','contact.html','cart.html'])assert.ok(s.includes(`href="${target}"`),f+' -> '+target);}
 assert.ok(pages.length>=6);
});
test('Product sizes have valid prices and local real photo assets',()=>{
 const context={window:{}};vm.runInNewContext(read('js/products.js'),context);const items=context.window.ESSENCE_PRODUCTS;
 assert.ok(items.length>=6);assert.equal(items.length,new Set(items.map(p=>p.id)).size);
 for(const p of items){assert.ok(existsSync(resolve(root,p.image)));assert.equal(p.sizes.length,new Set(p.sizes.map(s=>s.ml)).size);
 for(const s of p.sizes){assert.ok(Number.isInteger(s.ml)&&s.ml>0);assert.ok(Number.isInteger(s.price)&&s.price>0);}
 const encoded=read(p.image).match(/data:image\/webp;base64,([^"']+)/)?.[1];assert.ok(encoded);const data=Buffer.from(encoded,'base64');assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');}
});
function lum(hex){let h=hex.slice(1);if(h.length===3)h=h.split('').map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
test('Text tokens have at least 4.5:1 contrast on both themes main surfaces',()=>{
 const css=read('css/style.css');for(const block of [css.match(/:root\s*\{([^}]+)\}/)[1],css.match(/:root\[data-theme=dark\]\s*\{([^}]+)\}/)[1]]){
 const t=Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[a-f0-9]{3,8})/gi)].map(m=>[m[1],m[2]]));
 for(const fg of ['ink','muted'])for(const bg of ['bg','surface','paper','sage','rose']){const [a,b]=[lum(t[fg]),lum(t[bg])].sort((x,y)=>x-y);assert.ok((b+.05)/(a+.05)>=4.5,fg+' on '+bg);}}
});
