const CACHE_NAME = 'firstpwa';

function page(_page) {
  return [
      `/src/pages/${_page}/${_page}.html`,
      `/src/pages/${_page}/${_page}.js`
  ]
}

const libs = [
  '/lib/css/materialize.min.css',
  '/lib/js/materialize.min.js',
];

const pages = [
  'home',
].map(page).flat()

console.log(pages)

const styles = [
  'icons.css',
  'style.css',
].map((style) => `/src/css/${style}`);

const images = [
  'icon.svg',
  ...Array(7).fill().map(
    (_, i) => `cats/${i + 1}.jpg`,
  ),
].map((image) => `/assets/images/${image}`);

const icons = [
  'android-icon-192x192-dunplab-manifest-1009.png',
  'apple-icon-180x180-dunplab-manifest-1009.png',
  'apple-icon-152x152-dunplab-manifest-1009.png',
  'apple-icon-144x144-dunplab-manifest-1009.png',
  'apple-icon-120x120-dunplab-manifest-1009.png',
  'apple-icon-114x114-dunplab-manifest-1009.png',
  'favicon-96x96-dunplab-manifest-1009.png',
  'apple-icon-76x76-dunplab-manifest-1009.png',
  'apple-icon-72x72-dunplab-manifest-1009.png',
  'apple-icon-60x60-dunplab-manifest-1009.png',
  'apple-icon-57x57-dunplab-manifest-1009.png',
  'favicon-32x32-dunplab-manifest-1009.png',
  'favicon-16x16-dunplab-manifest-1009.png',
].map((icon) => `/assets/images/icons/${icon}`);

const urlsToCache = [
  '/',
  '/src/component/nav.html',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/assets/fonts/Montserrat-Regular.ttf',
  '/assets/fonts/Montserrat-Bold.ttf',
  '/assets/fonts/Material-Icons.woff2',
  '/src/js/main.js',
  ...libs,
  ...pages,
  ...styles,
  ...images,
  ...icons,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(
      (cache) => cache.addAll(urlsToCache),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request, { cacheName: CACHE_NAME, ignoreVary: true })
      .then((response) => {
        if (response) {
          console.log('Using cache: ', response.url);
          return response;
        }
        console.log(
          'Fetch server: ',
          event.request.url,
        );

        return fetch(event.request);
      }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName != CACHE_NAME) {
          console.log('ServiceWorker: cache ' + cacheName + ' dihapus');
          return caches.delete(cacheName);
        }
      }),
    )),
  );
});
