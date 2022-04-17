if(ticket == null){
	window.location.href = 'index.html';
}

socket.on('disconnect', () => {
	alert('You lost connection.');
	window.location.href = "index.html";
});

socket.on('errors', (error) =>{
	alert(error);
	window.location.href = "index.html";
})

socket.on('loggedOut', () =>{
	window.location.href = "index.html";
})

socket.emit('login', ticket);

socket.on('readyToPlay?', () =>{	//Server is asking if the player can be added on the client
	serverIsReady = true;
});

socket.on('loggedIn', (receivedPlayers) =>{	//Server response to "Im Ready";
	receivedPlayers.forEach(player => {
		if(player.id == playerId){
			localPlayer = new Player(player);
			objects.addChild(localPlayer);
		} 
		else if(player.id != playerId && !playersInGame.has(player.id)){
			let tempPlayer = new Player(player);
			playersInGame.set(player.id, tempPlayer);
			objects.addChild(tempPlayer);
			delete tempPlayer;
		}
	});
})

socket.on('newPlayer', (player) => {
	let tempPlayer = new Player(player);
	playersInGame.set(tempPlayer.id, tempPlayer); 
	objects.addChild(tempPlayer);
});

socket.on('byePlayer', (playerThatLeft) =>{
	let playerG = playersInGame.get(playerThatLeft.id);
	playersInGame.delete(playerThatLeft.id)
	objects.removeChild(playerG);
});

socket.on('joinRoom', (joinRoom) =>{
	currentRoom.changeRoom(joinRoom.name);
})

socket.on('leaveRoom', () => {
	objects.removeChildren(0, objects.children.length);
	playersInGame = new Map();
})

socket.on('playerIsMoving', (player) =>{
	let playerG = playersInGame.get(player.id);
	playerG.mouseX = player.mouseX;
	playerG.mouseY = player.mouseY
	playerG.move();
})

socket.on('playerSaid', (player) => {
	let playerO = getElementFromArray(player, 'id', objects.children);

	playerO.message = player.message;

	if(playerO.messageTimeout != undefined){
		clearTimeout(playerO.messageTimeout);
		if(playerO.bubble.children[0] !== undefined) playerO.bubble.removeChildAt(0);
		playerO.drawBubble();
	}else if(playerO.messageTimeout == undefined){
		playerO.drawBubble();
	}

	addToChatbox(`${playerO.username}: ${player.message}`);
});

socket.on('changedBio', (newBio) =>{
	let player = playersInGame.get(newBio.player);
	player.bio = newBio.newBio;
})

socket.on('changingInventory', (boolean) =>{
	setTimeout(() => {
		inventory.isChanging = boolean;
	}, 5000);
})

socket.on('changedBio', (newBio) =>{
	let player = getElementFromArrayByValue(newBio.player, id, playersObject);
	player.card.bio = newBio.newBio;
})

socket.on("resetInventory", (info) => {
	inventory.items = null;
})

socket.on('M', (s) =>{
	s.forEach((src) =>{
		let script = document.createElement('script');
		script.setAttribute('src', src);
		document.getElementById('Scripts').appendChild(script);
	})
})

socket.on("resetInventory", (info) => {
	inventory.items = null;
})

console.log("%cATTENTION!","color: #FF2D00; font-family:sans-serif; font-size: 45px; font-weight: 900; text-shadow: #000 3px 3px 3px");
console.log(`%cIf someone told you to copy/paste here, DON'T DO IT!`,"color: #F8FF00; font-family:sans-serif; font-size: 18px; font-weight: 900; text-shadow: #000 2px 2px 3px");
console.log(`%cThey might be trying to STEAL YOUR ACCOUNT!`,"color: #FCE92F; font-family:sans-serif; font-size: 14px; font-weight: 900; text-shadow: #000 2px 2px 2px");
