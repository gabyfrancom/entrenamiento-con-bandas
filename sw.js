/* Service worker de "Bandas en casa".
   Estrategia: responde desde la caché y actualiza en segundo plano (funciona sin conexión).
   Si cambias cualquier archivo, sube el número de CACHE para que los móviles recojan la versión nueva. */
const CACHE = 'bandas-en-casa-v3';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './fonts/figtree-latin-wght-normal.woff2', './fonts/sora-latin-wght-normal.woff2'];
const FOTOS = ['./img/ejercicios/abduccion-pie-1.webp', './img/ejercicios/abduccion-pie-2.webp', './img/ejercicios/aperturas-pecho-1.webp', './img/ejercicios/aperturas-pecho-2.webp', './img/ejercicios/cal-brazos-1.webp', './img/ejercicios/cal-brazos-2.webp', './img/ejercicios/cal-cadera-1.webp', './img/ejercicios/cal-cadera-2.webp', './img/ejercicios/cal-gato-1.webp', './img/ejercicios/cal-gato-2.webp', './img/ejercicios/caminata-lateral-1.webp', './img/ejercicios/caminata-lateral-2.webp', './img/ejercicios/crunch-rodillas-1.webp', './img/ejercicios/crunch-rodillas-2.webp', './img/ejercicios/curl-biceps-1.webp', './img/ejercicios/curl-biceps-2.webp', './img/ejercicios/curl-martillo-1.webp', './img/ejercicios/curl-martillo-2.webp', './img/ejercicios/elevacion-frontal-1.webp', './img/ejercicios/elevacion-frontal-2.webp', './img/ejercicios/elevacion-lateral-1.webp', './img/ejercicios/elevacion-lateral-2.webp', './img/ejercicios/elevacion-talones-1.webp', './img/ejercicios/elevacion-talones-2.webp', './img/ejercicios/empuje-triceps-1.webp', './img/ejercicios/empuje-triceps-2.webp', './img/ejercicios/extension-cadera-1.webp', './img/ejercicios/extension-cadera-2.webp', './img/ejercicios/extension-triceps-cabeza-1.webp', './img/ejercicios/extension-triceps-cabeza-2.webp', './img/ejercicios/face-pull-1.webp', './img/ejercicios/face-pull-2.webp', './img/ejercicios/flexiones-banda-1.webp', './img/ejercicios/flexiones-banda-2.webp', './img/ejercicios/jalon-puerta-1.webp', './img/ejercicios/jalon-puerta-2.webp', './img/ejercicios/lenador-1.webp', './img/ejercicios/lenador-2.webp', './img/ejercicios/pallof-press-1.webp', './img/ejercicios/pallof-press-2.webp', './img/ejercicios/patada-gluteo-1.webp', './img/ejercicios/patada-gluteo-2.webp', './img/ejercicios/peso-muerto-rumano-1.webp', './img/ejercicios/peso-muerto-rumano-2.webp', './img/ejercicios/plancha-abduccion-1.webp', './img/ejercicios/plancha-abduccion-2.webp', './img/ejercicios/press-hombro-1.webp', './img/ejercicios/press-hombro-2.webp', './img/ejercicios/press-pecho-1.webp', './img/ejercicios/press-pecho-2.webp', './img/ejercicios/puente-gluteo-mini-1.webp', './img/ejercicios/puente-gluteo-mini-2.webp', './img/ejercicios/pull-apart-1.webp', './img/ejercicios/pull-apart-2.webp', './img/ejercicios/remo-inclinado-1.webp', './img/ejercicios/remo-inclinado-2.webp', './img/ejercicios/remo-sentado-1.webp', './img/ejercicios/remo-sentado-2.webp', './img/ejercicios/rotacion-externa-1.webp', './img/ejercicios/rotacion-externa-2.webp', './img/ejercicios/sentadilla-mini-1.webp', './img/ejercicios/sentadilla-mini-2.webp', './img/ejercicios/sentadilla-pisada-1.webp', './img/ejercicios/sentadilla-pisada-2.webp', './img/ejercicios/vu-cuadriceps-1.webp', './img/ejercicios/vu-cuadriceps-2.webp', './img/ejercicios/vu-nino-1.webp', './img/ejercicios/vu-nino-2.webp', './img/ejercicios/vu-pecho-1.webp', './img/ejercicios/vu-pecho-2.webp', './img/ejercicios/yg-brazos-arriba-1.webp', './img/ejercicios/yg-brazos-arriba-2.webp', './img/ejercicios/yg-camello-1.webp', './img/ejercicios/yg-camello-2.webp', './img/ejercicios/yg-cuadriceps-cuatro-1.webp', './img/ejercicios/yg-cuadriceps-cuatro-2.webp', './img/ejercicios/yg-figura4-1.webp', './img/ejercicios/yg-figura4-2.webp', './img/ejercicios/yg-flexion-pie-1.webp', './img/ejercicios/yg-flexion-pie-2.webp', './img/ejercicios/yg-gusano-1.webp', './img/ejercicios/yg-gusano-2.webp', './img/ejercicios/yg-hidrante-1.webp', './img/ejercicios/yg-hidrante-2.webp', './img/ejercicios/yg-isquios-sentada-1.webp', './img/ejercicios/yg-isquios-sentada-2.webp', './img/ejercicios/yg-langosta-1.webp', './img/ejercicios/yg-langosta-2.webp', './img/ejercicios/yg-lateral-pie-1.webp', './img/ejercicios/yg-lateral-pie-2.webp', './img/ejercicios/yg-lateral-tumbada-1.webp', './img/ejercicios/yg-lateral-tumbada-2.webp', './img/ejercicios/yg-mariposa-1.webp', './img/ejercicios/yg-mariposa-2.webp', './img/ejercicios/yg-media-langosta-1.webp', './img/ejercicios/yg-media-langosta-2.webp', './img/ejercicios/yg-mundo-1.webp', './img/ejercicios/yg-mundo-2.webp', './img/ejercicios/yg-pierna-techo-1.webp', './img/ejercicios/yg-pierna-techo-2.webp', './img/ejercicios/yg-pinza-sentada-1.webp', './img/ejercicios/yg-pinza-sentada-2.webp', './img/ejercicios/yg-puente-1.webp', './img/ejercicios/yg-puente-2.webp', './img/ejercicios/yg-rodillas-pecho-1.webp', './img/ejercicios/yg-rodillas-pecho-2.webp', './img/ejercicios/yg-straddle-1.webp', './img/ejercicios/yg-straddle-2.webp', './img/ejercicios/yg-torsion-prono-1.webp', './img/ejercicios/yg-torsion-prono-2.webp', './img/ejercicios/yg-torsion-sentada-1.webp', './img/ejercicios/yg-torsion-sentada-2.webp', './img/ejercicios/yg-torsion-silla-1.webp', './img/ejercicios/yg-torsion-silla-2.webp', './img/ejercicios/yg-torsion-tumbada-1.webp', './img/ejercicios/yg-torsion-tumbada-2.webp', './img/ejercicios/yg-zancada-baja-1.webp', './img/ejercicios/yg-zancada-baja-2.webp', './img/ejercicios/yg-zancada-torsion-1.webp', './img/ejercicios/yg-zancada-torsion-2.webp', './img/ejercicios/zancada-atras-1.webp', './img/ejercicios/zancada-atras-2.webp'];

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
