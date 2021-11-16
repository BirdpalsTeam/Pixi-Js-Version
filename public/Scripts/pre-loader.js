var app, resources;
var serverIsReady, ticket, playerId;
var socket = io();
ticket = sessionStorage.ticket;
playerId = sessionStorage.playerId;

var loading_screen = document.getElementById('loading');

var objects, localPlayer, book;
var playersInGame = new Array();

var JSONSrc = 'JSONS/';
var spritesSrc = 'Sprites/';
var charactersSrc = spritesSrc + 'characters/';
var roomsSrc = spritesSrc + 'rooms/';
var hudSrc = spritesSrc + 'hud/';
var itemsSrc = spritesSrc + 'items/';
var audioSrc = 'Audio/';

var rooms, currentRoom, triggers, collisionArray, roomCollCellWidth, roomCollCellHeight, predictArray, triggers;
var foreground;

window.onload = ()=>{
	app = new WorldState(document.getElementById('game'));
	
	app.loader.add('allRooms', `${JSONSrc}roomsJSON.json`);
	app.loader.add('town', `${JSONSrc}town.json`)
	app.loader.add('bird_blue', `${JSONSrc}bird_blue.json`);
	app.loader.add('bubble_message', `${spritesSrc}hud/bubble.png`);
	app.loader.add('Arial', `${hudSrc}Arial.fnt`);
	app.loader.add('BCaslon_font', `${hudSrc}CaslonAntique-BoldItalic.fnt`);
	app.loader.add('Caslon_font', `${hudSrc}CaslonAntique-BoldItalic.ttf`)
	app.loader.add('book', `${hudSrc}book.png`);
	app.loader.add('book_X', `${hudSrc}book_X.png`);
	app.loader.add('f', `${hudSrc}test_bird.png`);
	app.loader.add('b', `${hudSrc}mask_bird.png`)
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
		objects = new PIXI.Container();
		objects.name = 'Objects';
		objects.sortableChildren = true;

		rooms = new PIXI.Container();
		rooms.name = 'Rooms';
		
		foreground = new PIXI.Container();
		foreground.name = 'Foreground';
		foreground.zIndex = 1;

		book = new PIXI.Container();
		book.name = 'Book';
		book.zIndex = 2;

		PIXI.BitmapFont.from("LUsernameFont", fontStyle('bolder', '#FFFFFF', '#000000'));
		PIXI.BitmapFont.from('NUsernameFont', fontStyle('normal', '#FFFFFF', '#000000'));
		
		app.viewport.addChild(rooms);
		app.viewport.addChild(objects);
		app.viewport.addChild(foreground);
		app.viewport.addChild(book);
		waitServerResponse();
	}

	function waitServerResponse(){
		if(serverIsReady == true){	//If the Classes.js script is ready and the server said we can continue
			socket.emit('Im Ready');
			currentRoom = new Room('town');
			rooms.addChild(currentRoom);
			currentRoom.getCollision('town');
			currentRoom.getObjects(true);
			
			let localG = document.createElement('script');
			localG.src = 'Scripts/localG.js';
			document.getElementById('Scripts').appendChild(localG);
		}else{
			window.setTimeout(waitServerResponse, 1000 / 60); 
		}
	}

	function fontStyle(fontWeight, fill, stroke){
		return {
		fontFamily: "Arial",
		fontSize: 18,
		strokeThickness: 6.5,
		fill: fill,
		stroke: stroke,
		lineJoin: 'round',
		fontWeight: fontWeight}
	}
}