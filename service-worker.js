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

	// Only handle same-origin
	if (url.origin !== location.origin) return;

	// For app shell & dynamic assets: try network first
	if (req.destination === 'document' || /\.(?:css|js)$/i.test(url.pathname)) {
		event.respondWith(
			fetch(req)
				.then(res => {
					const copy = res.clone();
					caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
					return res;
				})
				.catch(() => caches.match(req))
		);
		return;
	}

	// Other assets: cache first
	event.respondWith(
		caches.match(req).then(cached => cached || fetch(req).then(res => {
			const copy = res.clone();
			caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
			return res;
		}))
	);
});