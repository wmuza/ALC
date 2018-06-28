 /**
* Author: Wilbert Muza
* Version: 1.0.0
* Signature: wmuza
*/

'use strict';

$(document).ready(function (){
	fetchAllCurrencies();
});

/*
|------------------------------------------
| SERVICE WORKER SECTION
|------------------------------------------
*/

// register services worker
if(navigator.serviceWorker){
	// register the services worker
	registerServiceWorker();

	// listen for controller change
	navigator.serviceWorker.addEventListener('controllerchange', function (){
		window.location.reload();
	});

}else{
	console.log('browser does not support Services Worker !');
}

// registering services worker function
function registerServiceWorker() {
	// register the service worker
	navigator.serviceWorker.register('sw.js').then(function(sw) {
		// check service worker controller
		if(!navigator.serviceWorker.controller) return;

		// on waiting state
		if(sw.waiting){
			sw.postMessage('message', {action: 'skipWaiting'});
			return;
		}

		// on installing state
		if(sw.installing){
			trackInstalling(sw.installing);
		}

		// on updated found
		sw.addEventListener('updatefound', function (){
			trackInstalling(sw.installing);
		});
	});
}

// track sw state
function trackInstalling(worker) {
	worker.addEventListener('statechange', function(){
		if(worker.state == 'installed'){
			updateIsReady(worker);
		}
	});
}

// update app 
function updateIsReady(sw){
	pushUpdateFound();
}

// push updates
function pushUpdateFound() {
	$(".notify").fadeIn();
  	console.log('sw found some updates.. !');
}
