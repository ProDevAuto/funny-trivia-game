// Increment this version whenever you deploy style/script changes to force update
const CACHE_VERSION = 'v2';
const CACHE_NAME = `trivia-cache-${CACHE_VERSION}`;

const CORE_ASSETS = [
	'/',
	'/index.html',
	'/style.css',
	'/script.js',
	'/manifest.json',
	'/assets/icon.png',
	'/assets/correct.mp3',
	'/assets/wrong.mp3',
	'/assets/gifs/correct.gif',
	'/assets/gifs/wrong.gif'
];

// Install: pre-cache core assets
self.addEventListener('install', event => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
	);
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys.filter(k => k.startsWith('trivia-cache-') && k !== CACHE_NAME)
					.map(k => caches.delete(k))
		)).then(() => self.clients.claim())
	);
});

// Fetch: network-first for HTML/CSS/JS, cache-first for others
self.addEventListener('fetch', event => {
	const req = event.request;
	const url = new URL(req.url);

	// Skip cross-origin (e.g., OpenTDB) entirely - do not cache external dynamic data
	if (url.origin !== location.origin) {
		return; // allow normal network behavior
	}

	// Network-first for HTML/CSS/JS for freshness
	if (req.destination === 'document' || /\.(?:css|js)$/i.test(url.pathname)) {
		return event.respondWith(
			fetch(req)
				.then(res => {
					const copy = res.clone();
					caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
					return res;
				})
				.catch(() => caches.match(req))
		);
	}

	// Cache-first for static media (images, audio, gifs)
	if (/\.(?:png|jpg|jpeg|gif|mp3|svg|woff2?)$/i.test(url.pathname)) {
		return event.respondWith(
			caches.match(req).then(cached => cached || fetch(req).then(res => {
				const copy = res.clone();
				caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
				return res;
			}))
		);
	}

	// Fallback: try cache, else network (no new caching for unknown types)
	event.respondWith(caches.match(req).then(c => c || fetch(req)));
});