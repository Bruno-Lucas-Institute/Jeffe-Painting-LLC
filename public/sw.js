self.addEventListener('push', event => {
 let message = {title:'Jeffe Painting',body:'A new customer request is waiting in your inbox.'};
 try { if(event.data) message = event.data.json(); } catch { /* Keep generic notification. */ }
 event.waitUntil(self.registration.showNotification(message.title, {body:message.body,icon:'/app-icon-192.png',badge:'/app-icon-192.png',tag:'estimate-request'}));
});
self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	event.waitUntil(
		self.clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then(async (windows) => {
				for (const client of windows) {
					if (new URL(client.url).origin === self.location.origin) {
						await client.navigate("/admin");
						return client.focus();
					}
				}
				return self.clients.openWindow("/admin");
			}),
	);
});
