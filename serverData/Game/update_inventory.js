exports.run = (socket, rooms, AFKTime, PlayFabAdmin, PlayFabServer, server_utils, rateLimiter)=>{
	socket.on('/updateInventory', (playerInventory) => {
		if(socket.playerId == undefined || playerInventory == undefined) return;
		server_utils.resetTimer(socket, AFKTime);
		let thisPlayerId = socket.playerId;
		let thisPlayerRoom = rooms[socket.gameRoom];
		let player = thisPlayerRoom.players.get(socket.playerId);
		PlayFabAdmin.GetUserInventory({PlayFabId: socket.playerId}, (error,result) =>{
			if(result !== null){
				let items = new Array();
				let equippedItems = 0;
				let updatedPlayfab = 0;
				
				playerInventory.forEach((item) =>{
					if(server_utils.getElementFromArray(item, "ItemId", result.data.Inventory) !== false){ //Checks if player has the item they say they have
						if(item.CustomData.isEquipped == "true"){
							equippedItems += 1;
							PlayFabServer.UpdateUserInventoryItemCustomData({PlayfabId: socket.playerId, ItemInstanceId: item.ItemInstanceId, Data: {"isEquipped": "true"}}, (error, result) =>{
								if(result !== null){
									updatedPlayfab += 1;
									items.push({ItemClass: item.ItemClass, ItemId: item.ItemId, isEquipped: item.CustomData});
									if(updatedPlayfab == equippedItems){ //Checks if all items had been updated
										player.gear = items;
										socket.broadcast.to(socket.gameRoom).emit('playerUpdatedGear', {player: thisPlayerId, gear: items});
										socket.emit('changingInventory', false);
									}
								//	console.log(result);
								}else if(error !== null){
									console.log(error);
								}
							})
						}else if(item.CustomData.isEquipped == "false"){
							equippedItems += 1;
							PlayFabServer.UpdateUserInventoryItemCustomData({PlayfabId: socket.playerId, ItemInstanceId: item.ItemInstanceId, Data: {"isEquipped": "false"}}, (error, result) =>{
								if(result !== null){
									updatedPlayfab += 1;
									if(updatedPlayfab == equippedItems){//Checks if all items had been updated
										player.gear = items;
										socket.broadcast.to(socket.gameRoom).emit('playerUpdatedGear', {player: thisPlayerId, gear: items});
										socket.emit('changingInventory', false);
									}
								}else if(error !== null){
									console.log(error);
								}
							})
						}
					}
				})
			}else if(error !== null){
				console.log(error);
			}//User inventory end
		})
	})
}