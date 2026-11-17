// 공유로 받은 캡처를 잠깐 보관했다가 첫 화면에서 읽습니다
const V='ubitec-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png'])))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
  if(e.request.method==='POST'&&u.pathname.endsWith('/share')){e.respondWith((async()=>{
    const fd=await e.request.formData();const files=fd.getAll('img').filter(f=>f&&f.size);
    const c=await caches.open('ubitec-share');for(const k of await c.keys())await c.delete(k);
    for(let i=0;i<files.length;i++)await c.put('./shared/'+i,new Response(files[i],{headers:{'content-type':files[i].type||'image/jpeg'}}));
    return Response.redirect('./?share='+files.length+'&t='+Date.now(),303)})());return}
  if(e.request.method==='GET'&&u.origin===location.origin)e.respondWith(fetch(e.request).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
