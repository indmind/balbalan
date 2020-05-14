importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const {cacheNames, setCacheNameDetails} = workbox.core;
const {precacheAndRoute} = workbox.precaching;
const {registerRoute} = workbox.routing;
const {StaleWhileRevalidate, CacheFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;

setCacheNameDetails({
  prefix: 'balbalan',
  suffix: 'v1',
  precache: 'app-shell',
  runtime: 'external-resource',
});

function page([_page, revision]) {
  return [
    [`${_page}/${_page}.html`, revision],
    [`${_page}/${_page}.css`, revision],
    [`${_page}/${_page}.js`, revision],
  ];
}

function apply(context, files) {
  return files.map(([file, revision]) => ({
    url: context + file,
    revision,
  }));
}

function getPrecacheList() {
  const libs = [
    ['lib/css/materialize.min.css', 1],
    ['lib/js/materialize.min.js', 1],
    ['lib/js/idb.min.js', 1],
  ];

  const pages = [
    ['home', 1],
  ].map(page).flat();

  const styles = [
    ['icons.css', 1],
    ['style.css', 1],
  ];

  const images = [
    ['icon.svg', 1],
    ['goal.svg', 1],
    ['void.svg', 1],
  ];

  const icons = [
    'icon-72x72.png',
    'icon-96x96.png',
    'icon-128x128.png',
    'icon-144x144.png',
    'icon-152x152.png',
    'icon-192x192.png',
    'icon-384x384.png',
    'icon-512x512.png',
  ].map((icon) => [icon, 1]);

  const fonts = [
    ['Montserrat-Regular.ttf', 1],
    ['Montserrat-Bold.ttf', 1],
    ['Material-Icons.woff2', 1],
  ];

  const components = [
    ['nav.js', 1],
    ['team-item.js', 1],
    ['team-detail.js', 1],
  ];

  const scripts = [
    ['js/main.js', 1],
    ['js/registerServiceWorker.js', 1],
    ['services/db.js', 1],
    ['services/api.js', 1],
  ];

  return [
    {url: '/index.html', revision: 1},
    {url: '/favicon.ico', revision: 1},
    {url: '/manifest.json', revision: 1},
    apply('/', libs),
    apply('/src/', scripts),
    apply('/assets/fonts/', fonts),
    apply('/assets/images/', images),
    apply('/assets/images/icons/', icons),
    apply('/src/css/', styles),
    apply('/src/pages/', pages),
    apply('/src/component/', components),
  ].flat();
}

precacheAndRoute(getPrecacheList());

registerRoute(
    /https:\/\/api\.football-data\.org\/v2/,
    new StaleWhileRevalidate({
      cacheName: `${cacheNames.prefix}-api-resource-${cacheNames.suffix}`,
    }),
);

registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
);

self.addEventListener('push', (event) => {
  let body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = 'No payload';
  }

  event.waitUntil(
      self.registration.showNotification('Push Notification', {
        body,
        icon: '/assets/images/goal.svg',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      }),
  );
});
