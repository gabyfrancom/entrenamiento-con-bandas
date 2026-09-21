/* Service worker de "Bandas en casa".
   Estrategia: responde desde la caché y actualiza en segundo plano (funciona sin conexión).
   Si cambias cualquier archivo, sube el número de CACHE para que los móviles recojan la versión nueva. */
const CACHE = 'bandas-en-casa-v5';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
const FOTOS = ['./abduccion-pie-1.webp', './abduccion-pie-2.webp', './aperturas-pecho-1.webp', './aperturas-pecho-2.webp', './cal-brazos-1.webp', './cal-brazos-2.webp', './cal-cadera-1.webp', './cal-cadera-2.webp', './cal-gato-1.webp', './cal-gato-2.webp', './caminata-lateral-1.webp', './caminata-lateral-2.webp', './crunch-rodillas-1.webp', './crunch-rodillas-2.webp', './curl-biceps-1.webp', './curl-biceps-2.webp', './curl-martillo-1.webp', './curl-martillo-2.webp', './elevacion-frontal-1.webp', './elevacion-frontal-2.webp', './elevacion-lateral-1.webp', './elevacion-lateral-2.webp', './elevacion-talones-1.webp', './elevacion-talones-2.webp', './empuje-triceps-1.webp', './empuje-triceps-2.webp', './extension-cadera-1.webp', './extension-cadera-2.webp', './extension-triceps-cabeza-1.webp', './extension-triceps-cabeza-2.webp', './face-pull-1.webp', './face-pull-2.webp', './flexiones-banda-1.webp', './flexiones-banda-2.webp', './jalon-puerta-1.webp', './jalon-puerta-2.webp', './lenador-1.webp', './lenador-2.webp', './pallof-press-1.webp', './pallof-press-2.webp', './patada-gluteo-1.webp', './patada-gluteo-2.webp', './peso-muerto-rumano-1.webp', './peso-muerto-rumano-2.webp', './plancha-abduccion-1.webp', './plancha-abduccion-2.webp', './press-hombro-1.webp', './press-hombro-2.webp', './press-pecho-1.webp', './press-pecho-2.webp', './puente-gluteo-mini-1.webp', './puente-gluteo-mini-2.webp', './pull-apart-1.webp', './pull-apart-2.webp', './remo-inclinado-1.webp', './remo-inclinado-2.webp', './remo-sentado-1.webp', './remo-sentado-2.webp', './rotacion-externa-1.webp', './rotacion-externa-2.webp', './sentadilla-mini-1.webp', './sentadilla-mini-2.webp', './sentadilla-pisada-1.webp', './sentadilla-pisada-2.webp', './vu-cuadriceps-1.webp', './vu-cuadriceps-2.webp', './vu-nino-1.webp', './vu-nino-2.webp', './vu-pecho-1.webp', './vu-pecho-2.webp', './yg-brazos-arriba-1.webp', './yg-brazos-arriba-2.webp', './yg-camello-1.webp', './yg-camello-2.webp', './yg-cuadriceps-cuatro-1.webp', './yg-cuadriceps-cuatro-2.webp', './yg-figura4-1.webp', './yg-figura4-2.webp', './yg-flexion-pie-1.webp', './yg-flexion-pie-2.webp', './yg-gusano-1.webp', './yg-gusano-2.webp', './yg-hidrante-1.webp', './yg-hidrante-2.webp', './yg-isquios-sentada-1.webp', './yg-isquios-sentada-2.webp', './yg-langosta-1.webp', './yg-langosta-2.webp', './yg-lateral-pie-1.webp', './yg-lateral-pie-2.webp', './yg-lateral-tumbada-1.webp', './yg-lateral-tumbada-2.webp', './yg-mariposa-1.webp', './yg-mariposa-2.webp', './yg-media-langosta-1.webp', './yg-media-langosta-2.webp', './yg-mundo-1.webp', './yg-mundo-2.webp', './yg-pierna-techo-1.webp', './yg-pierna-techo-2.webp', './yg-pinza-sentada-1.webp', './yg-pinza-sentada-2.webp', './yg-puente-1.webp', './yg-puente-2.webp', './yg-rodillas-pecho-1.webp', './yg-rodillas-pecho-2.webp', './yg-straddle-1.webp', './yg-straddle-2.webp', './yg-torsion-prono-1.webp', './yg-torsion-prono-2.webp', './yg-torsion-sentada-1.webp', './yg-torsion-sentada-2.webp', './yg-torsion-silla-1.webp', './yg-torsion-silla-2.webp', './yg-torsion-tumbada-1.webp', './yg-torsion-tumbada-2.webp', './yg-zancada-baja-1.webp', './yg-zancada-baja-2.webp', './yg-zancada-torsion-1.webp', './yg-zancada-torsion-2.webp', './zancada-atras-1.webp', './zancada-atras-2.webp'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      await c.addAll(CORE);                       // imprescindible
      await Promise.allSettled(FOTOS.map((u) => c.add(u)));   // las fotos no bloquean la instalación
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const red = fetch(req).then((res) => {
        if (res && res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
        return res;
      }).catch(() => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
      return hit || red;
    })
  );
});
