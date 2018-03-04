var view = {
	wyswietlKomunikat: function(msg){
		document.getElementById("komunikat").innerHTML = msg;
		},
	wyswietlTrafiony: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "trafiony");
	},
	wyswietlPudlo: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "pudlo");	
		
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships :[
	{locations: [0, 0, 0], hits:["", "", ""]},
	{locations: [0, 0, 0], hits:["", "", ""]},
	{locations: [0, 0, 0], hits:["", "", ""]}
	],
	
	fire: function(guess) {
		
		for (var i=0; i<this.numShips; i++){
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.wyswietlTrafiony(guess);
				view.wyswietlKomunikat("Trafiony")
				if (this.isSunk(ship)){
						view.wyswietlKomunikat("Zatopiłeś statek")
						this.shipsSunk++;
				}
				return true;
				
			} 
		}
		view.wyswietlPudlo(guess);
		view.wyswietlKomunikat("Pudło");
		return false;
	},
	isSunk: function(ship) {
		for (var i=0; i<this.shipLength; i++){
			if ( ship.hits[i] !== "hit"){
				return false;
			}
			
		}
		return true;
	},
	
	generateShipLocations: function() {
		var locations;
		for ( var i = 0; i< this.numShips; i++){
			do {
				locations = this.generateShip()
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	
	generateShip: function() {
		var direction = Math.floor(Math.random()*2);
		var row, col;
		if (direction === 1) { 
			row = Math.floor(Math.random()* this.boardSize);
			col = Math.floor(Math.random()* (this.boardSize - this.shipLength));
			}
		else {
			row = Math.floor(Math.random()* (this.boardSize - this.shipLength));
			col = Math.floor(Math.random()* this.boardSize);
			}
		var newShipLocations = [];
		for (var i =0; i < this.shipLength; i++){
			if (direction = 1){
				newShipLocations.push(row +""+(col+i))
			}
			else { newShipLocations.push((row+i) +""+col)}
		} return newShipLocations;
	},
	
	collision: function(locations){
		for (var i = 0; i< this.numShips; i++){
			var ship = model.ships[i];
			
			for (var j=0; j<locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >=0) {
					return true;
				}
			}	
		} return false;
	}
};

var controller = {
	guesses: 0,
	processGuess: function(guess){
		var location = parseGuess(guess);
		if (location){
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipSunk === model.numShips) {
				view.wyswietlKomunikat("Zatopiłeś wszystkie okręty, gratulacje. Strzelałeś " + this.guesses + " razy.");
			}
		}
		
	}
	
};

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Ups, proszę wpisać literę i cyfrę.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Ups, to nie są współrzędne!");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Ups, pole poza planszą!");
		} else {
			return row + column;
		}
	}
	return null;
}

function init() {
	document.getElementById("celPal").onclick = handleFireButton;
	document.getElementById("strzal").onkeypress = handleKeyPress;
	
	model.generateShipLocations()
}

function handleFireButton() {
	var guess = document.getElementById("strzal").value;
	controller.processGuess(guess);
	document.getElementById("strzal").value = "";
}

function handleKeyPress(e) {
	if (e.keyCode === 13) {
		document.getElementById("celPal").click();
		return false;
	}
}

window.onload = init
