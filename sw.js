// Combineta · avisos al celular
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = {}; }
  e.waitUntil(self.registration.showNotification(d.title || "Combineta 🐴", {
    body: d.body || "Hay novedades en tus viajes. Tocá para ver.",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: "combineta",
    renotify: true,
    data: { url: d.url || "./#mis" }
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./#mis", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
    for (const v of ventanas) {
      if ("focus" in v) {
        if ("navigate" in v) v.navigate(url).catch(() => {});
        return v.focus();
      }
    }
    return self.clients.openWindow(url);
  }));
});
