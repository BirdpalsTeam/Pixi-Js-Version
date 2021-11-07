class Room extends PIXI.Sprite{
	constructor(room){
		super(resources[`${room}_background`].texture);
		this.name = room;
		this.loader = new PIXI.Loader();
		this.loader.onComplete.add(this.finishedLoading);
		this.loader.onError.add(this.loadingError);
		this.loader.resources[this.name] = PIXI.Texture.from(resources.allRooms.data[room].images.background);
	}

	changeRoom(newRoom){
		this.name = `${newRoom}_background`;
		if(this.loader.resources[this.name] !== undefined){
			this.changeTexture();
		}else{
			this.loader.add(this.name, resources.allRooms.data[newRoom].images.background);
			this.loader.load();
			loading_screen.hidden = false;
		}
	}

	loadingError(e){
		console.error(`There was an error when loading: ${e.message}`);
	}
	
	finishedLoading(e){
		currentRoom.changeTexture();
		loading_screen.hidden = true;
	}

	changeTexture(){
		this.texture = this.loader.resources[this.name].texture;
	}
}