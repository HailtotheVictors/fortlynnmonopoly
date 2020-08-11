var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  'FortLynnMonopoly/index.html',
  'FortLynnMonopoly/styles.html',
  'FortLynnMonopoly/script.html',
  'FortLynnMonopoly/favicon.png',
  'FortLynnMonopoly/Kabel-Heavy.woff',
  'FortLynnMonopoly/Kabel-Heavy.woff2',
  'FortLynnMonopoly/line.gif',
  'FortLynnMonopoly/logo.png',
  'FortLynnMonopoly/spaces.js',
  'FortLynnMonopoly/stocks.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
