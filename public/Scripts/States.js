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
		this.viewport = new pixi_viewport.Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: this.stage.width,
			worldHeight: this.stage.height,
		
			interaction: this.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
		})
		this.stage.addChild(this.viewport);
	}

	onClick(evt){
		if(localPlayer.canMove == true){
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
}