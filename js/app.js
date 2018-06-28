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


/*
|------------------------------------------
| INDEXED DB SECTION
|------------------------------------------
*/
if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB");
}

// open database 
function openDatabase(){
	// return db instances
	const DB_NAME 	= 'alc';
	const database 	= indexedDB.open(DB_NAME, 1);

	// on error catch errors 
	database.onerror = (event) => {
		console.log('error opening web database');
		return false;
	};

	// check db version
	database.onupgradeneeded = function(event) {
	  	// listen for the event response
	  	var upgradeDB = event.target.result;

	  	// create an objectStore for this database
	  	var objectStore = upgradeDB.createObjectStore("currencies");
	};

	// return db instance
	return database;
}


// Save to Database
function saveToDatabase(data){
	// initialise database
	const db = openDatabase();
	
	// on success add user
	db.onsuccess = (event) => {

		const query = event.target.result;

	  	// check if currency already exist
		const currency = query.transaction("currencies").objectStore("currencies").get(data.symbol);

		// wait for users to arrive
	  	currency.onsuccess = (event) => {
	  		const dbData = event.target.result;
	  		const store  = query.transaction("currencies", "readwrite").objectStore("currencies");

	  		if(!dbData){ 
	  			// save data into currency object
				store.add(data, data.symbol);
	  		}else{
	  			// update data existing currency object
				store.put(data, data.symbol);
	  		};
	  	}
	}
}


// fetch from database
function fetchFromDatabase(symbol, amount) {
	// initialise database
	const db = openDatabase();
	
	// on success add user
	db.onsuccess = (event) => {

		//add event listener on Convet Button
		document.getElementById('convert-btn').addEventListener('click', ()=>{
			$(".results").hide();
        });
		
		// console.log('database has been openned !');
		const query = event.target.result;

		// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(symbol);

		// wait for users to arrive
	  	currency.onsuccess = (event) => {
	  		const data = event.target.result;
	  		// console.log(data);
	  		if(data == null){
	  			$(".error_msg").append(`
					<div class="output-results">
		                <span class="text-danger">
		                	You are currently offline... please check your internet connectivity and try again.
		                </span>
					</div>
				`);

				// void
				return;
	  		}

			// console.log(data);
			// console.log(data);
			let pairs = symbol.split('_');
			let fr = pairs[0];
			let to = pairs[1];
			let frElement = document.getElementById('from-currency');
			let frText = frElement.options[frElement.selectedIndex].innerHTML;
			let toElement = document.getElementById('to-currency');
			let toText = toElement.options[toElement.selectedIndex].innerHTML;
			
			$(".results").append(`
				<div class="output-results">	       
					<b>${amount} </b> <b> ${frText}</b><br> = <br><b>${(amount * val.val).toFixed(2)} ${toText}</b>
				</div>
			`);
	  	}
	}
}