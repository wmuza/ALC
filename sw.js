 /**
* Author: Wilbert Muza
* Version: 1.0.0
* Signature: wmuza
* ALC Currency Converter
*/

// registering service worker cache 
var appCacheName = 'currency-converter--static-v12';
var urlsToCache = [
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
	  'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js'
];


// on install state
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(appCacheName)
      .then((cache) => cache.addAll(urlsToCache))
  )
});

// on activate state
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('currency-converter-') &&
            cacheName !== appCacheName;
        }).map(cacheName => caches.delete(cacheName))
      );
    })
  );
})

// on fetch state
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        )
      })
  )
});

// on message
self.addEventListener('message', function(event){
	if(event.data.action == 'skipWaiting'){
		self.skipWaiting();
	}
});