 /**
* Author: Wilbert Muza
* Version: 1.0.0
* Signature: wmuza
* ALC Currency Converter
*/

// registering service worker cache 
var appCacheName = 'wnes-static-v1';
var appCacheAssets = [
	  'https://wmuza.github.io/ALC/',
	  'https://wmuza.github.io/ALC/index.html',
	  'https://wmuza.github.io/ALC/css/app.css',
	  'https://wmuza.github.io/ALC/js/app.js',
	  'https://wmuza.github.io/ALC/img/icon.png',
	  'https://wmuza.github.io/ALC/img/background-image.png',
	  'https://wmuza.github.io/ALC/fonts/montserrat/Montserrat-Regular.ttf',
	  'https://wmuza.github.io/ALC/fonts/montserrat/Montserrat-ExtraBold.ttf',
	  'https://wmuza.github.io/ALC/fonts/montserrat/Montserrat-Bold.ttf',
	  'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
	  'https://free.currencyconverterapi.com/api/v5/currencies',
	  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css',	 
	  'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js',
];

// on install state
self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(appCacheName).then(function(cache){
			return cache.addAll(appCacheAssets);
		})
	);
});

// on activate state
self.addEventListener('activate', function(event){
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.filter(function(cacheName){
					return cacheName.startsWith('wnes-') && cacheName !== appCacheName;
				}).map(function(cacheName){
					return caches.delete(cacheName);
				})
			);
		})
	);
});

// on fetch state
self.addEventListener('fetch', function(event){
	// event.respondWith('hello');
	// console.log('hello');
	event.respondWith(
		caches.match(event.request).then(function(response){
			if(response){
				return response;
			}
			return fetch(event.request);
		})
	);
});

// on message
self.addEventListener('message', function(event){
	if(event.data.action == 'skipWaiting'){
		self.skipWaiting();
	}
});