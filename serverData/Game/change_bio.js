const { profanity } = require('super-profanity')

exports.run = (socket, rooms, AFKTime, PlayFabAdmin, profanity, server_utils, rateLimiter)=>{
	socket.on('/changeBio', (newBio) =>{
		if(socket.playerId == undefined || newBio == undefined || typeof newBio !== "string" || newBio.length > 144) return;
		server_utils.resetTimer(socket, AFKTime);
		let thisPlayerRoom = rooms[socket.gameRoom];
		let player = thisPlayerRoom.players.get(socket.playerId);
		if(profanity(newBio).isBadWord){
			newBio = 'I wish the world becomes a better place!';
			updateBio();
		}else{
			updateBio();
		}

		function updateBio(){
			PlayFabAdmin.UpdateUserReadOnlyData({PlayFabId: socket.playerId, Data:{biography: newBio}}, (error, result) =>{
				if(result !== null){
					if(player == undefined) return;
					player.bio = newBio;
					socket.broadcast.to(socket.gameRoom).emit('changedBio', {player: socket.playerId, newBio: newBio});
				}else if(error !== null){
					console.log(error);
				}
			})
		}
	})
}