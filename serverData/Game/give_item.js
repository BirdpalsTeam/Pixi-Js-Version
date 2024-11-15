exports.run = (socket, AFKTime, PlayFabServer, server_utils, rateLimiter)=>{
	var freeItems = ["eye_patch", "pirate_hat"];

	socket.on('getFreeItem', (itemInfo) => {
		server_utils.resetTimer(socket, AFKTime);

		server_utils.getPlayerInventory(socket.playerId).then(result =>{
			let alreadyHasItem = false;
			result.data.Inventory.forEach(item=>{
				if(item.ItemId === itemInfo.name){
					alreadyHasItem = true;
					return;
				}
			});
			if(!alreadyHasItem){
				for(let i = 0; i < freeItems.length; i++){
					if(itemInfo.name == freeItems[i]){
						server_utils.grantItemsToUser("Birdpals Catalog", [itemInfo.name], socket.playerId).then(result =>{
							i = freeItems.length;
							let tempItemInstanceId = result.data.ItemGrantResults[0].ItemInstanceId;
							PlayFabServer.UpdateUserInventoryItemCustomData({PlayFabId:socket.playerId,ItemInstanceId:tempItemInstanceId,Data: {"isEquipped": "false"}});
							socket.emit("resetInventory");
						}).catch(console.log);
					}
				}
			}
		})
	});
}