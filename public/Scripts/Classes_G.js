class Room extends PIXI.Sprite{
	constructor(room){
		super(resources[room].textures[`${room}_background.png`]);
		this.originalRoom = room;
		this.name = room;
		this.loader = new PIXI.Loader();
		this.loader.onComplete.add(this.finishedLoading);
		this.loader.onError.add(this.loadingError);
		new Foreground(room);
	}

	changeRoom(newRoom){
		this.name = newRoom;
		if(this.loader.resources[this.name] !== undefined){
			this.changeTexture();
			this.getObjects();
		}else if(newRoom == this.originalRoom){
			this.texture = resources[newRoom].textures[`${newRoom}_background.png`];
			foreground.children[0].changeTexture(newRoom, true);
			this.getObjects(true);
		}else{
			this.loader.add(newRoom, `${JSONSrc + newRoom}.json`);
			this.loader.load();
			loading_screen.hidden = false;
		}
		this.getCollision(newRoom);
	}

	loadingError(e){
		console.error(`There was an error when loading: ${e.message}`);
	}
	
	finishedLoading(e){
		currentRoom.changeTexture();
		currentRoom.getObjects();
		loading_screen.hidden = true;
	}

	changeTexture(){
		this.texture = this.loader.resources[this.name].textures[`${this.name}_background.png`];
		foreground.children[0].changeTexture(this.name);
	}

	getCollision(newRoom){
		collisionArray = new Array();
		let roomsData = resources.allRooms.data;
		let roomCollMapX = roomsData[newRoom].roomCollMapX;
		let roomCollMapY = roomsData[newRoom].roomCollMapY;
		roomCollCellWidth = 1000 / roomCollMapX;
		roomCollCellHeight = 600 / roomCollMapY;
		let roomCollMap = roomsData[newRoom].roomCollMap;
		triggers = roomsData[newRoom].triggers;
		predictArray = roomsData[newRoom].noCollidersArea;
		for(let y = 0; y < roomCollMapY; y++){
			for(let x = 0; x < roomCollMapX; x++){
				if(roomCollMap[y*roomCollMapX+x] == 1){
					collisionArray.push(roomCollCellWidth * x, roomCollCellHeight * y);
				}
			}
		}
	}

	activateTrigger(triggerArray){
		switch(triggerArray[4]){
			case "changeRoom":
				setLocalMessage("/room " + triggerArray[5]);
				break;
			case "getFreeItem":
				socket.emit("getFreeItem", triggerArray[5]);
				break;
		}
	}

	getObjects(isOriginal){
		if(isOriginal == true){
			for(let roomObject in resources[this.name].data.frames){
				if(roomObject.includes('background') != true && roomObject.includes('foreground') != true){
					objects.addChild(new RoomObject(this.name, roomObject, resources));
				}
			}
		}else{
			for(let roomObject in this.loader.resources[this.name].data.frames){
				if(roomObject.includes('background') != true && roomObject.includes('foreground') != true){
					objects.addChild(new RoomObject(this.name, roomObject, this.loader.resources));
				}
			}
		}
	}
}

class RoomObject extends PIXI.Sprite{
	constructor(room, RoomObject, resources){
		super(resources[room].textures[RoomObject]);
		let thisData = resources[room].data.frames[RoomObject];
		this.x = thisData.position.x;
		this.y = thisData.position.y;
		this.zIndex = this.y + (this.height / 2);
	}
}

class Foreground extends PIXI.Sprite{
	constructor(room){
		super(resources[room].textures[`${room}_foreground.png`]);
		this.Data = resources[room].data.frames[`${room}_foreground.png`];
		this.x = 0;
		this.y = this.Data.frame.y - this.Data.frame.h;
		foreground.addChild(this);
	}
	changeTexture(newRoom, isOriginal){
		if(isOriginal == true){
			this.texture = resources[newRoom].textures[`${newRoom}_foreground.png`];
			this.Data = resources[newRoom].data.frames[`${newRoom}_foreground.png`];
			this.y = this.Data.frame.y - this.Data.frame.h;
		}else{
			this.texture = currentRoom.loader.resources[newRoom].textures[`${newRoom}_foreground.png`];
			this.Data = currentRoom.loader.resources[newRoom].data.frames[`${newRoom}_foreground.png`];
			this.y = this.Data.frame.y;
		}
	}
}