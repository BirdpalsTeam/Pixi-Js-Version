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
		if(player.id == playerId && localPlayer == undefined){
			localPlayer = new Player(player);
			players.addChild(localPlayer);
		} 
		else if(player.id != playerId && !checkIfElementIsInArray(player, 'id', playersInGame)){
			let tempPlayer = new Player(player);
			playersInGame.push(tempPlayer);
			players.addChild(tempPlayer);
			delete tempPlayer;
		}
	});
	loading_screen.hidden = true;
})

socket.on('newPlayer', (player) => {
	console.log(player)
	let tempPlayer = new Player(player);
	playersInGame.push(tempPlayer); 
	players.addChild(tempPlayer);
});

socket.on('byePlayer', (playerThatLeft) =>{
	let playerG = getElementFromArray(playerThatLeft, playerThatLeft.id, playersInGame);
	removeElementFromArray(playerG, playersInGame);
	players.removeChild(playerG);
});

socket.on('joinRoom', (joinRoom) =>{
	currentRoom.changeRoom(joinRoom.name);
})

socket.on('leaveRoom', () => {
	playersInGame = [];
})

socket.on('playerIsMoving', (player) =>{
	let playerG = getElementFromArray(player, player.id, playersInGame);
	playerG.mouseX = player.mouseX;
	playerG.mouseY = player.mouseY
	playerG.move();
})