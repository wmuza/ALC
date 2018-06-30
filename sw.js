 /**
* Author: Wilbert Muza
* Version: 1.0.0
* Signature: wmuza
* ALC Currency Converter
*/

// registering service worker cache 
let appCacheName = 'wnes-static-v2';
let appCacheAssets = [
	  'https://wmuza.github.io/ALC/',
	  'https://wmuza.github.io/ALC/index.html',
	  'https://wmuza.github.io/ALC/css/app.css',
	  'https://wmuza.github.io/ALC/js/app.js',
	  'https://wmuza.github.io/ALC/img/icon.png',
	  'https://wmuza.github.io/ALC/img/background-image-min.jpg',	  
	  'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
	  'https://free.currencyconverterapi.com/api/v5/currencies',
	  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css',	 
	  'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js'
];


// on install state
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(appCacheName).then( cache => {
			return cache.addAll(appCacheAssets);
		})
	);
});

// on activate state
self.addEventListener('activate', event =>{
	event.waitUntil(
		caches.keys().then( cacheNames => {
			return Promise.all(
				cacheNames.filter( 
					cacheName => cacheName.startsWith('wnes-') && cacheName !== appCacheName
				).map( 
					cacheName => caches.delete(cacheName)
				)
			);
		})
	);
});

// on fetch state
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then( response => {
			if(response){
				return response;
			}
			return fetch(event.request);
		})
	);
});

// on message
self.addEventListener('message', event => {
	if(event.data.action == 'skipWaiting'){
		self.skipWaiting();
	}
});
