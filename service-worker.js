const NAME = 'firstpwa';
const VERSION = 1;

const CACHE_NAME = `${NAME}-${VERSION}`;

function page(_page) {
  return [
    `/src/pages/${_page}/${_page}.html`,
    `/src/pages/${_page}/${_page}.js`,
  ];
}

const libs = [
  '/lib/css/materialize.min.css',
  '/lib/js/materialize.min.js',
];

const pages = [
  'home',
].map(page).flat();

const styles = [
  'icons.css',
  'style.css',
].map((style) => `/src/css/${style}`);

const images = [
  'icon.svg',
  'goal.svg',
].map((image) => `/assets/images/${image}`);

const icons = [
  'android-icon-192x192-dunplab-manifest-2212.png',
  'apple-icon-180x180-dunplab-manifest-2212.png',
  'apple-icon-152x152-dunplab-manifest-2212.png',
  'apple-icon-144x144-dunplab-manifest-2212.png',
  'apple-icon-120x120-dunplab-manifest-2212.png',
  'apple-icon-114x114-dunplab-manifest-2212.png',
  'favicon-96x96-dunplab-manifest-2212.png',
  'apple-icon-76x76-dunplab-manifest-2212.png',
  'apple-icon-72x72-dunplab-manifest-2212.png',
  'apple-icon-60x60-dunplab-manifest-2212.png',
  'apple-icon-57x57-dunplab-manifest-2212.png',
  'favicon-32x32-dunplab-manifest-2212.png',
  'favicon-16x16-dunplab-manifest-2212.png',
].map((icon) => `/assets/images/icons/${icon}`);

const fonts = [
  'Montserrat-Regular.ttf',
  'Montserrat-Bold.ttf',
  'Material-Icons.woff2',
].map((font) => `/assets/fonts/${font}`);

const components = [
  'nav.js',
  'team-item.js',
  'team-detail.js',
].map((component) => `/src/component/${component}`);

const scripts = [
  'js/main.js',
  'services/api.js',
].map((script) => `/src/${script}`);

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  ...scripts,
  ...fonts,
  ...libs,
  ...components,
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
  // const API_ENDPOINT = "http://192.168.100.3:3000/"
  const API_ENDPOINT = 'https://api.football-data.org/v2/';

  if (!(event.request.url.indexOf('http') === 0)) {
    return event.respondWith(fetch(event.request));
  }

  if (event.request.url.includes(API_ENDPOINT)) {
    // Stale While Revalidate
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>
          cache.match(event.request).then((response) => {
            const fetchResponse = fetch(event.request).then((netResponse) => {
              if (netResponse.ok) {
                cache.put(event.request, netResponse.clone());
              }

              return netResponse;
            });

            return response || fetchResponse;
          }),
        ),
    );
  } else {
    // Cache First (Cache Fallback to Network)
    event.respondWith(
        caches.match(event.request, {
          ignoreSearch: true,
          ignoreVary: true,
        }).then(
            (response) => {
              if (response) return response;

              console.log('not using cache', event.request.url);

              return caches.open(CACHE_NAME).then(
                  (cache) => fetch(event.request).then((netResponse) => {
                    cache.put(event.request, netResponse.clone());
                    return netResponse;
                  }),
              );
            },
        ),
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes(NAME) && cacheName != CACHE_NAME) {
              console.log('ServiceWorker: cache ' + cacheName + ' dihapus');
              return caches.delete(cacheName);
            }
          }),
      )),
  );
});
