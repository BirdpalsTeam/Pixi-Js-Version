exports.run = (
  socket,
  rooms,
  AFKTime,
  PlayFabAdmin,
  PlayFabServer,
  server_utils
) => {
  socket.on('/updateInventory', (playerInventory) => {
    if (socket.playerId == undefined || playerInventory == undefined) return;
    server_utils.resetTimer(socket, AFKTime);

    let thisPlayerId = socket.playerId;
    let thisPlayerRoom = rooms[socket.gameRoom];
    let player = thisPlayerRoom.players.get(socket.playerId);

    PlayFabAdmin.GetUserInventory(
      { PlayFabId: thisPlayerId },
      (error, result) => {
        if (result !== null) {
          let items = new Map();

          playerInventory.forEach((item) => {
            // Checks if player has the item they say they have
            if (
              server_utils.getElementFromArray(
                item,
                'ItemId',
                result.data.Inventory
              ) !== false
            ) {
              PlayFabServer.UpdateUserInventoryItemCustomData(
                {
                  PlayfabId: socket.playerId,
                  ItemInstanceId: item.ItemInstanceId,
                  Data: {
                    isEquipped:
                      item.CustomData.isEquipped === 'true' ? 'true' : 'false',
                  },
                },
                (error, result) => {
                  if (result !== null) {
                    items.set(item.ItemId, {
                      ItemClass: item.ItemClass,
                      ItemId: item.ItemId,
                      isEquipped: item.CustomData,
                    });
                  } else if (error !== null) {
                    console.log(error);
                  }
                }
              );
            }
          });

          player.gear = items;
          socket.broadcast.to(socket.gameRoom).emit('playerUpdatedGear', {
            player: thisPlayerId,
            gear: items,
          });
          socket.emit('changingInventory', false);
        } else if (error !== null) {
          console.log(error);
        }
      }
    );
  });
};
