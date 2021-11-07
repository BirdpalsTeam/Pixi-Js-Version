class State extends PIXI.Application{
	constructor(htmlElement){
		super({
			width: 1000,
			height: 600,
			view: htmlElement
		});

		this.stage.on('pointerdown', (evt)=>{
			this.onClick(evt);
		})

	}
}

class WorldState extends State{
	constructor(htmlElement){
		super(htmlElement);
		resources = this.loader.resources;
		this.stage.interactive = true;
	}

	onClick(evt){
		localPlayer.mouseX = Math.floor(evt.data.global.x);
		localPlayer.mouseY = Math.floor(evt.data.global.y);
		localPlayer.move();
		const playerMovement = {
			mouseX: localPlayer.mouseX,
			mouseY: localPlayer.mouseY
		}
		socket.emit('playerMovement', playerMovement);
	}
}