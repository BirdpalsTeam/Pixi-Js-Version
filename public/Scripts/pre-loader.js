var app, resources;
var serverIsReady, ticket, playerId;
var socket = io();
ticket = sessionStorage.ticket;
playerId = sessionStorage.playerId;

var loading_screen = document.getElementById('loading');

var players, localPlayer;
var playersInGame = new Array();

var JSONSrc = 'JSONS/';
var spritesSrc = 'Sprites/';
var charactersSrc = spritesSrc + 'characters/';
var roomsSrc = spritesSrc + 'rooms/';
var hudSrc = spritesSrc + 'hud/';
var itemsSrc = spritesSrc + 'items/';
var audioSrc = 'Audio/';

var rooms, currentRoom, triggers;

window.onload = ()=>{
	app = new WorldState(document.getElementById('game'));
	
	app.loader.add('allRooms', `${JSONSrc}roomsJSON.json`);
	app.loader.add('bird_blue', `${JSONSrc}bird_blue.json`);
	app.loader.add('town_background', `${spritesSrc}rooms/town/town_background.png`);
	app.loader.add('bubble_message', `${spritesSrc}hud/bubble.png`);
	app.loader.add('Arial', `${hudSrc}Arial.fnt`);
	app.loader.add('Caslon_font', `${hudSrc}CaslonAntique-BoldItalic.fnt`);
	app.loader.onProgress.add(showLoading);
	app.loader.onComplete.add(finishedPreLoading);
	app.loader.onError.add(loadingError);
	
	app.loader.load();

	function showLoading(e){
		console.log(e.progress);
		loading_screen.hidden = false;
	}
	
	function loadingError(e){
		console.error(`There was an error when loading: ${e.message}`);
	}
	
	function finishedPreLoading(){
		players = new PIXI.Container();
		players.name = 'Players';

		rooms = new PIXI.Container();
		rooms.name = 'Rooms';

		app.stage.addChild(rooms);
		app.stage.addChild(players);
		waitServerResponse();
	}

	function waitServerResponse(){
		if(serverIsReady == true){	//If the Classes.js script is ready and the server said we can continue
			socket.emit('Im Ready');
			currentRoom = new Room('town');
			rooms.addChild(currentRoom);
			let localG = document.createElement('script');
			localG.src = 'Scripts/localG.js';
			document.getElementById('Scripts').appendChild(localG);
		}else{
			window.setTimeout(waitServerResponse, 1000 / 60); 
		}
	}
}