/* Push only: never cache owner pages, credentials, API responses or client details. */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("push",event=>{let data={};try{data=event.data?event.data.json():{};}catch{/* Always show a user-visible fallback. */}event.waitUntil(self.registration.showNotification(data.title||"New request",{body:data.body||"Open your dashboard to review requests.",icon:"/icon",badge:"/icon",tag:data.tag||"owner-update",data:{url:"/owner"}}));});
self.addEventListener("notificationclick",event=>{event.notification.close();const target=new URL("/owner",self.location.origin).href;event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:"window",includeUncontrolled:true});for(const client of windows){if(new URL(client.url).origin===self.location.origin&&"focus" in client){await client.navigate(target);return client.focus();}}return self.clients.openWindow(target);})());});
self.addEventListener('push', event => {
 let message = {title:'Jeffe Painting',body:'A new customer request is waiting in your inbox.'};
 try { if(event.data) message = event.data.json(); } catch { /* Keep generic notification. */ }
 event.waitUntil(self.registration.showNotification(message.title, {body:message.body,icon:'/app-icon-192.png',badge:'/app-icon-192.png',tag:'estimate-request'}));
});
self.addEventListener('notificationclick', event => {
 event.notification.close();
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async windows => {
  for (const client of windows) { if (new URL(client.url).origin === self.location.origin) { await client.navigate('/admin'); return client.focus(); } }
  return self.clients.openWindow('/admin');
 }));
});
