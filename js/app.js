/**
* Author: Wilbert Muza
* Version: 1.0.0
* Signature: wmuza
*/

'use strict';

$(document).ready( () => { 
	const registerServiceWorker = new MainController();	
});

/*
|------------------------------------------
| SERVICE WORKER SECTION
|------------------------------------------
*/

// A base class is defined using the new reserved 'class' keyword
class MainController {
  
  // constructor
  constructor () {
	// registering services worker
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker.register('/ALC/sw.js').then( sw => {
	  
	  // Notify on the console
      //console.log('ServiceWorker successful with scope: ', sw.scope);
      
	  // check service worker controller
	  if (!navigator.serviceWorker.controller) {
        return;
      }

	  // Check if on waiting state
      if (sw.waiting) {
        MainController.updateReady(sw.waiting);
        return;
      }

	  // Check if on installing state
      if (sw.installing) {
        MainController.trackInstalling(sw.installing);
        return;
      }

	  // Add Event Listener on updatefound
      sw.addEventListener('updatefound', () => {
        MainController.trackInstalling(sw.installing);
      });

      // Refreshing
	  let refresh;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refresh) return;
        window.location.reload();
        refresh = true;
      });
    });
	
	//Fetch all currencies
	fetchAllCurrencies();
  }

  static trackInstalling(worker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        MainController.updateReady(worker);
      }
    });
  }

  static updateReady(worker) {
    MainController.showAlert('New version available');
	$("#refresh").click( () => worker.postMessage({ action: 'skipWaiting' }) );	
  }

  // update-only notification alert
  static showAlert(message) {
	$("#alert").css('display','block');
    $("#alert-message").innerHTML(message
	$("#dismiss").click( () => $("#alert").fadeOut() );
  }
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
const openDatabase = () => {
	// return db instances
	const DB_NAME 	= 'alc';
	const database 	= indexedDB.open(DB_NAME, 1);

	// on error catch errors 
	database.onerror = event => {
		console.log('error opening web database');
		return false;
	};

	// check db version
	database.onupgradeneeded = event => {
	  	// listen for the event response
	  	let upgradeDB = event.target.result;

	  	// create an objectStore for this database
	  	let objectStore = upgradeDB.createObjectStore("currencies");
	};

	// return db instance
	return database;
}


// Save to Database
const saveToDatabase = data => {
	// initialise database
	const db = openDatabase();
	
	// on success add user
	db.onsuccess = event => {

		const query = event.target.result;

	  	// check if currency already exist
		const currency = query.transaction("currencies").objectStore("currencies").get(data.symbol);

		// wait for users to arrive
	  	currency.onsuccess = event => {
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
const fetchFromDatabase = (symbol, amount) => {
	// initialise database
	const db = openDatabase();
	
	// on success add user
	db.onsuccess = event => {

		//add event listener on Convet Button
		document.getElementById('convert-btn').addEventListener('click', () => {
			$(".results").html("");
        });
		
		const query = event.target.result;

		// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(symbol);

		// wait for users to arrive
	  	currency.onsuccess =  event => {
	  		const data = event.target.result;
			
	  		// Check if currency exist in IndexDB
	  		if(data == null){
	  			$(".error_msg").append(`
					<div class="output-results">
		                <span class="text-danger">
		                	You are currently offline... please check your internet connectivity and try again.
		                </span>
					</div>
				`);

				// hide error message
				setTimeout( e => $(".error_msg").html(""), 3000);
				
				// return void
				return;
	  		}

			// Getting Symbols;
			let frElement = document.getElementById('from-currency');
			let toElement = document.getElementById('to-currency');
			let frText = frElement.options[frElement.selectedIndex].innerHTML;			
			let toText = toElement.options[toElement.selectedIndex].innerHTML;
			
			$(".results").append(`
				<div class="output-results">	       
					<b>${amount} </b> <b> ${frText}</b><br> = <br><b>${(amount * data.value).toFixed(2)} ${toText}</b>
				</div>
			`);
	  	}
	}
}



/*
|------------------------------------------
| API SECTION
|------------------------------------------
*/
// fetch all currencies from the API
const fetchAllCurrencies = e => {
	// Getting all currrencies from the url here
	$.get('https://free.currencyconverterapi.com/api/v5/currencies', data => {
		// if data not fetch
		if(!data) console.log("Could not fetch any data");
		
		// convert data results into an array
		const resultdata = objectToArray(data.results);

		// used for of loop
		for(let val of resultdata){
			// using template leteral
			$("#from-currency").append(`
				<option value="${val.id}">${val.id} (${val.currencyName})</option>
			`);
			$("#to-currency").append(`
				<option value="${val.id}">${val.id} (${val.currencyName})</option>
			`);
		}
	})
	.fail( () => console.log( "Could not fetch any currencies Data" ) );
}



// convert currencies 
const convertCurrency = () => {
	let fromCurrency 	= $("#from-currency").val();
	let toCurrency 		= $("#to-currency").val();
	let amount	= $("#convert-amount").val();

	//Remove Previous Results 
	document.getElementById('convert-btn').addEventListener('click', () => {
			$(".output-results").html('');
    });
		
	// restrict user for converting same currency
	if(fromCurrency == toCurrency){
		$(".error_msg").html(`
			<div class="output-results">
				<span class="text-danger">
					Ops!, you can't convert the same currency
				</span>
			</div>
		`);		
				
		// stop proccess
		return false;
	}

	// build query 
	let body  = `${fromCurrency}_${toCurrency}`;
	let query = {
		q: body
	};

	// convert currencies
	$.get('https://free.currencyconverterapi.com/api/v5/convert', query, data => {
		// convert to array
		const pairs = objectToArray(data.results);
		let frElement = document.getElementById('from-currency');
		let toElement = document.getElementById('to-currency');
		let frText = frElement.options[frElement.selectedIndex].innerHTML;
		let toText = toElement.options[toElement.selectedIndex].innerHTML;

		// iterate pairs
		$.each(pairs, (index, val) => {
			$(".results").append(`
				<div class="output-results">	       
					<b>${amount} </b> <b> ${frText}</b><br> = <br><b>${(amount * val.val).toFixed(2)} ${toText}</b>
				</div>
			`);

			// save object results for later use
			let object = {
				symbol: body,
				value: val.val
			};

			// save to database
			saveToDatabase(object);
		});
	}).fail((err) => {
		// check currencies from indexedDB
		fetchFromDatabase(body, amount);
	});

	// void form
	return false;
}


// Mapping Objects into an Array using Map
const objectToArray = objects => {
	const results = Object.keys(objects).map(i => objects[i]);
	return results;
}