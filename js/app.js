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