/* Ordu Savasi - kayit dosyasi (disa/ice aktar) + kalici depolama */
(function(){
var DB="ordu-savasi-v3",KEYS=["profil","savas"];
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist();}catch(e){}
function db(){return new Promise(function(r){try{var q=indexedDB.open(DB,1);q.onupgradeneeded=function(){q.result.createObjectStore("kv")};q.onsuccess=function(){r(q.result)};q.onerror=q.onblocked=function(){r(null)}}catch(e){r(null)}})}
function get(d,k){return new Promise(function(r){try{var g=d.transaction("kv","readonly").objectStore("kv").get(k);g.onsuccess=function(){r(g.result)};g.onerror=function(){r(undefined)}}catch(e){r(undefined)}})}
function put(d,k,v){return new Promise(function(r){try{var t=d.transaction("kv","readwrite");t.objectStore("kv").put(v,k);t.oncomplete=r;t.onerror=r}catch(e){r()}})}
async function dump(){var d=await db(),o={oyun:"ordu-savasi-v3",tarih:new Date().toISOString(),veri:{}};for(var i=0;i<KEYS.length;i++){var k=KEYS[i],v=d?await get(d,k):undefined;if(v===undefined){try{var s=localStorage.getItem(DB+":"+k);if(s)v=JSON.parse(s)}catch(e){}}if(v!==undefined&&v!==null)o.veri[k]=v}return o}
async function exp(){var o=await dump();var b=new Blob([JSON.stringify(o)],{type:"application/json"});var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="ordu-savasi-kayit-"+o.tarih.slice(0,10)+".json";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000)}
function imp(){var f=document.createElement("input");f.type="file";f.accept=".json,application/json";f.onchange=async function(){var x=f.files&&f.files[0];if(!x)return;try{var o=JSON.parse(await x.text());if(!o||o.oyun!=="ordu-savasi-v3"||!o.veri)throw 0;var d=await db();for(var k in o.veri){if(d)await put(d,k,o.veri[k]);try{localStorage.setItem(DB+":"+k,JSON.stringify(o.veri[k]))}catch(e){}}alert("Kayit yuklendi. Oyun yeniden aciliyor.");location.reload()}catch(e){alert("Gecersiz kayit dosyasi")}};f.click()}
/* yedek: IndexedDB'deki kaydi her 30 sn localStorage'a da yansit */
async function mirror(){try{var o=await dump();for(var k in o.veri)localStorage.setItem(DB+":"+k,JSON.stringify(o.veri[k]))}catch(e){}}
setInterval(mirror,30000);addEventListener("pagehide",mirror);
function ui(){var b=document.createElement("div");b.id="kayitBtn";b.textContent="\u{1F4BE}";b.title="Kayit dosyasi";b.style.cssText="position:fixed;left:6px;bottom:6px;z-index:2147483647;width:34px;height:34px;line-height:34px;text-align:center;border-radius:50%;background:rgba(0,0,0,.45);font-size:18px;cursor:pointer;user-select:none";
var m=document.createElement("div");m.style.cssText="position:fixed;left:6px;bottom:46px;z-index:2147483647;display:none;background:#222;border:1px solid #555;border-radius:10px;padding:6px;font:14px sans-serif";
function it(t,fn){var e=document.createElement("div");e.textContent=t;e.style.cssText="color:#fff;padding:10px 14px;cursor:pointer;white-space:nowrap";e.onclick=function(){m.style.display="none";fn()};m.appendChild(e)}
it("\u2B07 Kaydi dosyaya indir",exp);it("\u2B06 Dosyadan kayit yukle",imp);
b.onclick=function(){m.style.display=m.style.display==="none"?"block":"none"};document.body.appendChild(m);document.body.appendChild(b)}
if(document.body)ui();else addEventListener("DOMContentLoaded",ui);
window.OrduKayit={disaAktar:exp,iceAktar:imp,dokum:dump};
})();
