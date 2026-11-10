const $ = id => document.getElementById(id);
const positions = ["PRESIDE","SEGUNDA VOZ","CORO 1","CORO 2","CORO 3","CORO 4","PIANO 1","PIANO 2","BATERÍA"];
const DB_NAME = "jerico-announcements"; const DB_VERSION = 1; let db, currentId = null, shirtData = "";
const defaults = {
  fridayDate:"", fridayTime:"18:30", sundayDate:"", sundayTime:"09:00",
  friday:["HNA YAHOSKA","HNO VICTOR","HNO EVELYN","HNO JHONY","HNA ERIKA","HNA ZULMA","NORVIN","HNA LAURA","HNO DANIEL"],
  sunday:["HNO JHONY","HNA EVELYN","HNO VICTOR","HNA ZULMA","HNA YAHOSKA","HNA ERIKA","HNO NORVIN","HNA LAURA","HNO DANIEL"],
  prayerTitle:"SEMANA DE AYUNO", prayerDays:"MARTES, MIÉRCOLES Y JUEVES", prayerInfo:"",
  shirtTitle:"CAMISA DOMINGO BLANCA", weekName:""
};
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains("announcements"))d.createObjectStore("announcements",{keyPath:"id"});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
function store(mode="readonly"){return db.transaction("announcements",mode).objectStore("announcements");}
function allSaved(){return new Promise((resolve,reject)=>{const r=store().getAll();r.onsuccess=()=>resolve(r.result.sort((a,b)=>b.updated-a.updated));r.onerror=()=>reject(r.error);});}
function getSaved(id){return new Promise((resolve,reject)=>{const r=store().get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
function putSaved(item){return new Promise((resolve,reject)=>{const r=store("readwrite").put(item);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);});}
function deleteSaved(id){return new Promise((resolve,reject)=>{const r=store("readwrite").delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);});}
function makeFields(id,arr){$(id).innerHTML=positions.map((p,i)=>`<label>${p}<input data-team="${id}" data-index="${i}" maxlength="42" value="${esc(arr[i]||"")}" aria-label="${p}"></label>`).join("");}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function val(id){return $(id).value.trim();}
function readForm(){const getTeam=id=>[...document.querySelectorAll(`[data-team="${id}"]`)].map(x=>x.value.trim());return {
 id:currentId, weekName:val("weekName"), fridayDate:$("fridayDate").value, fridayTime:$("fridayTime").value,
 sundayDate:$("sundayDate").value, sundayTime:$("sundayTime").value,
 friday:getTeam("fridayFields"), sunday:getTeam("sundayFields"),
 prayerTitle:val("prayerTitle"),prayerDays:val("prayerDays"),prayerInfo:val("prayerInfo"),
 shirtTitle:val("shirtTitle"),shirtImage:shirtData,updated:Date.now()
};}
function setForm(d){currentId=d.id||null;["fridayDate","fridayTime","sundayDate","sundayTime","prayerTitle","prayerDays","prayerInfo","shirtTitle","weekName"].forEach(k=>$(k).value=d[k]??"");makeFields("fridayFields",d.friday||Array(9).fill(""));makeFields("sundayFields",d.sunday||Array(9).fill(""));shirtData=d.shirtImage||"";updateThumb();render();}
function resetForm(){setForm({...defaults,id:null,shirtImage:""});$("saveStatus").textContent="Nuevo anuncio listo.";}
function formatDate(v){if(!v)return "FECHA POR DEFINIR";const [y,m,d]=v.split("-").map(Number);return new Intl.DateTimeFormat("es-MX",{day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(y,m-1,d));}
function formatTime(v){if(!v)return "HORA POR DEFINIR";const [h,m]=v.split(":").map(Number);return new Intl.DateTimeFormat("es-MX",{hour:"numeric",minute:"2-digit"}).format(new Date(2020,0,1,h,m));}
function wrapText(text,maxChars){const words=String(text||"").split(/\s+/);let lines=[],line="";for(const w of words){if(!w)continue;const next=line?line+" "+w:w;if(next.length>maxChars&&line){lines.push(line);line=w;}else line=next;}if(line)lines.push(line);return lines;}
function svgText(text,x,y,size=18,weight=700,anchor="start",fill="#171717",max=30,lineHeight=1.18){const lines=wrapText(text,max);return `<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}">${lines.map((t,i)=>`<tspan x="${x}" dy="${i?size*lineHeight:0}">${esc(t)}</tspan>`).join("")}</text>`;}
function render(){
 const d=readForm(), W=900,H=1200, left=55,right=845,gap=24,col=(right-left-gap)/2;
 const logoHref="assets/logo.png";
 let s=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="900" height="1200" fill="#f7f6f1"/>`;
 s+=`<image href="${logoHref}" x="25" y="22" width="130" height="130" preserveAspectRatio="xMidYMid meet"/>`;
 s+=svgText("ALABANZA MINISTERIO JERICO",175,92,37,800,"start","#786451",29);
 s+=`<rect x="55" y="170" width="375" height="105" rx="9" fill="#fff" stroke="#8c7d6e" stroke-width="2"/><rect x="470" y="170" width="375" height="105" rx="9" fill="#fff" stroke="#8c7d6e" stroke-width="2"/>`;
 s+=svgText("FECHA Y HORA",242,198,16,700,"middle","#786451",22);
 s+=svgText(formatDate(d.fridayDate),242,232,25,800,"middle","#111",24);
 s+=svgText(formatTime(d.fridayTime),242,261,26,800,"middle","#111",20);
 s+=svgText("FECHA Y HORA",657,198,16,700,"middle","#786451",22);
 s+=svgText(formatDate(d.sundayDate),657,232,25,800,"middle","#111",24);
 s+=svgText(formatTime(d.sundayTime),657,261,26,800,"middle","#111",20);
 function assignmentBox(x,title,arr){let out=`<rect x="${x}" y="320" width="${col}" height="440" rx="8" fill="#fff" stroke="#8c7d6e" stroke-width="2"/><rect x="${x+38}" y="300" width="${col-76}" height="54" rx="14" fill="#786451"/>`;out+=svgText(title,x+col/2,336,22,800,"middle","#fff",22);arr.forEach((name,i)=>{const line="• "+positions[i]+": "+(name||"—");const maxWidth=col-48;out+=`<text x="${x+24}" y="${385+i*39}" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="700" fill="#111" textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs">${esc(line)}</text>`;});return out;}
 s+=assignmentBox(55,"SERVICIO VIERNES",d.friday);s+=assignmentBox(470,"SERVICIO DOMINGO",d.sunday);
 s+=`<rect x="55" y="800" width="${col}" height="340" rx="8" fill="#fff" stroke="#8c7d6e" stroke-width="2"/><rect x="93" y="780" width="${col-76}" height="54" rx="14" fill="#786451"/>`;
 s+=svgText("ORACIÓN NOCTURNA",242,816,21,800,"middle","#fff",22);
 s+=svgText(d.prayerTitle||" ",242,885,23,800,"middle","#111",25);
 s+=svgText(d.prayerDays||" ",242,950,18,700,"middle","#111",30);
 s+=svgText(d.prayerInfo||" ",242,1008,15,500,"middle","#333",39);
 s+=`<rect x="470" y="800" width="${col}" height="340" rx="8" fill="#fff" stroke="#8c7d6e" stroke-width="2"/><rect x="508" y="780" width="${col-76}" height="54" rx="14" fill="#786451"/>`;
 s+=svgText("CAMISA DOMINGO",657,816,21,800,"middle","#fff",22);
 s+=svgText(d.shirtTitle||" ",657,870,19,800,"middle","#111",30);
 if(d.shirtImage){s+=`<image href="${d.shirtImage}" x="520" y="885" width="315" height="230" preserveAspectRatio="xMidYMid meet"/>`;}
 else{s+=`<rect x="520" y="890" width="315" height="220" rx="8" fill="#f5f2ed" stroke="#cfc5b9" stroke-dasharray="7 5"/><text x="677" y="1005" text-anchor="middle" font-family="Arial" font-size="22" fill="#8a7b6d" font-weight="700">FOTO DE CAMISA</text>`;}
 s+=`<text x="450" y="1177" text-anchor="middle" font-family="Arial" font-size="12" fill="#897c70">ALABANZA MINISTERIO JERICO</text></svg>`;
 $("poster").innerHTML=s;
}
function updateThumb(){const img=$("shirtThumb"),btn=$("removePhoto");if(shirtData){img.src=shirtData;img.hidden=false;btn.hidden=false;}else{img.hidden=true;img.removeAttribute("src");btn.hidden=true;}}
async function fileToData(file){if(file.size>12*1024*1024)throw new Error("La foto es demasiado grande. Elige una imagen menor de 12 MB.");return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const max=1500,scale=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement("canvas");c.width=Math.round(im.width*scale);c.height=Math.round(im.height*scale);c.getContext("2d").drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",.88));};im.onerror=()=>reject(new Error("No se pudo abrir la fotografía."));im.src=r.result;};r.onerror=()=>reject(new Error("No se pudo leer la fotografía."));r.readAsDataURL(file);});}
async function save(){try{const d=readForm();if(!d.weekName)d.weekName=d.fridayDate?`Semana ${formatDate(d.fridayDate)}`:`Anuncio ${new Date().toLocaleDateString("es-MX")}`;d.id=currentId||crypto.randomUUID();d.created=currentId?(await getSaved(currentId))?.created||Date.now():Date.now();await putSaved(d);currentId=d.id;$("weekName").value=d.weekName;$("saveStatus").textContent="Anuncio guardado correctamente.";await renderSaved();}catch(e){$("saveStatus").textContent="No se pudo guardar. Revisa el espacio disponible del dispositivo.";}}
async function renderSaved(){const list=await allSaved();$("savedList").innerHTML=list.length?list.map(d=>`<article class="saved-item"><div><strong>${esc(d.weekName||"Anuncio sin nombre")}</strong><small>Actualizado: ${new Date(d.updated).toLocaleString("es-MX")}</small></div><div class="saved-actions"><button class="button secondary" data-action="open" data-id="${d.id}">Abrir</button><button class="button secondary" data-action="duplicate" data-id="${d.id}">Duplicar</button><button class="button secondary" data-action="delete" data-id="${d.id}">Eliminar</button></div></article>`).join(""):'<p class="hint">Todavía no hay anuncios guardados.</p>';}
async function exportPNG(){const status=$("exportStatus");try{status.textContent="Preparando imagen...";render();const svg=$("poster").querySelector("svg");const clone=svg.cloneNode(true);const logoImg=await fetch("assets/logo.png").then(r=>{if(!r.ok)throw Error();return r.blob();});const logoURL=await blobData(logoImg);const imgs=[...clone.querySelectorAll("image")];for(const im of imgs){const href=im.getAttribute("href")||im.getAttributeNS("http://www.w3.org/1999/xlink","href");if(href==="assets/logo.png")im.setAttribute("href",logoURL);}
 const xml=new XMLSerializer().serializeToString(clone);const blob=new Blob([xml],{type:"image/svg+xml;charset=utf-8"});const url=URL.createObjectURL(blob);const image=new Image();await new Promise((res,rej)=>{image.onload=res;image.onerror=()=>rej(new Error("No se pudo preparar el diseño."));image.src=url;});const canvas=document.createElement("canvas");canvas.width=2700;canvas.height=3600;const ctx=canvas.getContext("2d");ctx.fillStyle="#f7f6f1";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);const png=await new Promise(r=>canvas.toBlob(r,"image/png"));if(!png)throw Error("El navegador no pudo crear el archivo PNG.");downloadBlob(png,`${safeName(readForm().weekName||"anuncio-jerico")}.png`);status.textContent="Imagen PNG lista para compartir.";}catch(e){status.textContent="No se pudo exportar la imagen. Intenta con una foto más pequeña o vuelve a cargar la página.";}}
function blobData(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(blob);});}
function safeName(s){return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9-_]+/gi,"-").replace(/^-|-$/g,"").toLowerCase()||"anuncio";}
function downloadBlob(blob,name){const a=document.createElement("a"),u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);}
function exportPDF(){render();window.print();}
function showSection(id){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.target===id));$(id).scrollIntoView({behavior:"smooth",block:"start"});}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.target)));
document.addEventListener("input",e=>{if(e.target.matches("input,textarea"))render();});
$("shirtImage").addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;try{shirtData=await fileToData(f);updateThumb();render();}catch(err){alert(err.message);}e.target.value="";});
$("removePhoto").addEventListener("click",()=>{shirtData="";updateThumb();render();});
$("saveBtn").addEventListener("click",save);$("newBtn").addEventListener("click",()=>{if(confirm("¿Crear un anuncio nuevo? Guarda primero los cambios actuales si los necesitas."))resetForm();});
$("pngBtn").addEventListener("click",exportPNG);$("pdfBtn").addEventListener("click",exportPDF);
$("savedList").addEventListener("click",async e=>{const b=e.target.closest("button[data-action]");if(!b)return;const id=b.dataset.id,action=b.dataset.action;if(action==="open"){const d=await getSaved(id);if(d){setForm(d);showSection("editor");}}if(action==="duplicate"){const d=await getSaved(id);if(d){d.id=null;d.weekName=(d.weekName||"Anuncio")+" - copia";setForm(d);currentId=null;$("saveStatus").textContent="Copia abierta. Guárdala para crear un anuncio independiente.";showSection("editor");}}if(action==="delete"&&confirm("¿Eliminar este anuncio guardado? Esta acción no se puede deshacer.")){await deleteSaved(id);await renderSaved();}});
(async()=>{try{db=await openDB();makeFields("fridayFields",defaults.friday);makeFields("sundayFields",defaults.sunday);setForm({...defaults,id:null});await renderSaved();if("serviceWorker"in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});}catch(e){alert("No se pudo iniciar el almacenamiento local. Revisa que el navegador permita almacenamiento para este sitio.");}})();
