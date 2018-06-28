 /**
* Author: Wilbert Muza
* Version: 1.0.0
* Signature: wmuza
* ALC Currency Converter
*/

// registering service worker cache 
var appCacheName = 'alc-static-v1';
var appCacheAssets = [
	  '/',
	  '/index.html',
	  '/css/app.css',
	  '/js/app.js',
	  '/img/icon.png',
	  '/img/background-image.png',
	  '/fonts/montserrat/Montserrat-Regular.ttf',
	  '/fonts/montserrat/Montserrat-ExtraBold.ttf',
	  '/fonts/montserrat/Montserrat-Bold.ttf',
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
