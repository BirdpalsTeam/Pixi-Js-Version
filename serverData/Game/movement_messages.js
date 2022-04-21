exports.run = (socket, rooms, AFKTime, client, server_discord, server_utils, profanity) => {
	socket.on('playerMovement', (playerMovement) =>{
		if(socket.playerId == undefined) return;
		server_utils.resetTimer(socket, AFKTime);
		let thisPlayerRoom = rooms[socket.gameRoom];
		let player = thisPlayerRoom.players.get(socket.playerId);
		let movePlayerObject = {
			id: player.id,
			mouseX: playerMovement.mouseX, 
			mouseY: playerMovement.mouseY
		}
		player.mouseX = playerMovement.mouseX;
		player.mouseY = playerMovement.mouseY;
		if(player.isMoving == false){
			player.move(thisPlayerRoom);
		}else{
			clearInterval(player.movePlayerInterval);
			player.isMoving = false;
			player.move(thisPlayerRoom);
		}
		socket.broadcast.to(socket.gameRoom).emit('playerIsMoving', movePlayerObject);
    })//Player Movement end

	socket.on('message',(message)=>{
		if(socket.playerId == undefined || message == undefined) return;
		server_utils.resetTimer(socket, AFKTime);
		let thisPlayerRoom = rooms[socket.gameRoom];
		let player = thisPlayerRoom.players.get(socket.playerId);
		let channel = client.channels.cache.get('845340183984341075');
		let dateUTC = new Date(Date.now()).toUTCString();
		if(server_utils.separateString(message)[0].includes("/") == false){
			if(profanity.filter(message).isBadWord){
				let messageObject = {
					id: player.id,
					message: ":("
				}
				let embed = server_discord.embedText(dateUTC + '\n' + player.username + ' said:', message);
				console.log(dateUTC +'\n' + player.username + ' said: ' + message + '\n');
				channel.send(embed.setColor("#FF0000"));
				socket.emit('playerSaid', messageObject);
				socket.broadcast.to(socket.gameRoom).emit('playerSaid', messageObject);
			}else{
				let messageObject = {
					id: player.id,
					message: message
				}
				let embed = server_discord.embedText(dateUTC + '\n' +player.username + ' said:', message);
				console.log(dateUTC +'\n' + player.username + ' said: ' + message + '\n');
				//channel.send(embed.setColor("1ABBF5"))
				socket.broadcast.to(socket.gameRoom).emit('playerSaid', messageObject);
			}
		}
	})

	socket.on('/room', (message) =>{
		if(socket.playerId == undefined) return;
		server_utils.resetTimer(socket, AFKTime);
		let thisPlayerRoom = rooms[socket.gameRoom];
		let player = thisPlayerRoom.players.get(socket.playerId);
		message = server_utils.separateString(message);
		let wantedRoom = rooms[message[1]];
		if(wantedRoom == false) return; //Check if the room the player wants to go exists
		if(player.isMoving == true){
			clearInterval(player.movePlayerInterval);
			player.isMoving = false;
		}
		player.x = wantedRoom.exit[0];
		player.y = wantedRoom.exit[1];
		player.mouseX = wantedRoom.exit[2];
		player.mouseY = wantedRoom.exit[3];
		thisPlayerRoom.players.delete(player.id); //Remove player from the room
		socket.broadcast.to(socket.gameRoom).emit('byePlayer', player);//Say to everyone on the room that this player is gone
		socket.emit('leaveRoom');
		socket.leave(socket.gameRoom); //Leave room on server
		socket.join(wantedRoom.name); //Join new room
		socket.gameRoom = wantedRoom.name;
		wantedRoom.players.set(player.id, player);
		socket.emit('joinRoom',{name: wantedRoom.name, posX: player.x, posY: player.y});
		socket.broadcast.to(socket.gameRoom).emit('newPlayer', (player)); //Say to everyone on the new room that the player is there
		let preventRecursion = wantedRoom.players;
		preventRecursion.forEach( (player) => {
			if(player.isMoving == true){
				clearInterval(player.movePlayerInterval);
				player.isMoving = false;
				player.x = player.mouseX;
				player.y = player.mouseY;
			}
		})
		socket.emit('loggedIn', (preventRecursion)); //Say to the player who are in the new room
	})
}