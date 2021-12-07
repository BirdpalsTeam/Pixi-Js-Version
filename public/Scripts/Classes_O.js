class BigBird extends PIXI.Sprite{
	constructor(player){
		super(resources.big_bird.texture);
		this.player = player;
		this.filters = player.filters;
	}

	updateColor(){
		this.filters = this.player.filters;
	}
}

class Book extends PIXI.Sprite{
	constructor(player){
		super(resources.book.texture);
		this.visible = false;
		this.x = 50;
		this.y = 40;
		this.isOpen = false;
		this.closeButton = this.addChild(PIXI.Sprite.from(resources.book_X.texture));
		this.closeButton.x = 795;
		this.closeButton.y = 24;
		this.closeButton.interactive = true;
		this.closeButton.buttonMode = true;
		this.closeButton.scale.set(0.35, 0.35);
		this.closeButton.on('pointerdown', (event) => {this.close()});
		this.closeButton.on('pointerover', (event) => {this.closeButton.tint =  0xA3A3A3});
		this.closeButton.on('pointerout', (event) => {this.closeButton.tint =  0xFFFFFF});
		this.bio = player.bio;
		this.username = player.username;
		this.big_bird = new BigBird(player);
		this.big_bird.x = 125;
		this.big_bird.y = 100;
		this.addChild(this.big_bird);
	}

	open(){
		if(this.isOpen != true){
			localPlayer.canMove = false;
			this.visible = true;
			transparentBg.visible = true;
			chatbox.hidden = true;
			playersInGame.forEach((player) =>{
				player.interactive = false;
			})
			this.customOpen();
		}
	}

	customOpen(){

	}

	customClose(){

	}

	close(){
		this.customClose();
		this.visible = false;
		transparentBg.visible = false;
		this.isOpen = false;
		isChatBoxToggle == true ? chatbox.hidden = true : chatbox.hidden = false;
		playersInGame.forEach((player) =>{
			player.interactive = true;
		})
		setTimeout(() => {
			localPlayer.canMove = true;
		}, 10);
	}
}

class BirdColorReplacement extends PIXI.Filter{
	constructor(newColor, epsilon){
		if(epsilon == undefined){epsilon = 0.4}
		super(null, resources.colorReplacementFrag.data, {
			originalColor: PIXI.utils.hex2rgb(0x359ade),
			newColor: PIXI.utils.hex2rgb(newColor),
			epsilon: epsilon
		})
	}
}

class MultiBirdColorReplacement extends PIXI.Filter{
	constructor(originalColor, newColor){
		super(null, resources.shader.data, {
			bottomColor: PIXI.utils.hex2rgb(0x2975aa),
			upperColor: PIXI.utils.hex2rgb(0x359ade),
			newBottomColor: PIXI.utils.hex2rgb(0x000000),
			newUpperColor: PIXI.utils.hex2rgb(0xFF0000)
		})
	}
}

class SnowParticle extends PIXI.particles.Emitter{
	constructor(){
		super(particles, PIXI.particles.upgradeConfig(resources.snow.data, [resources.snowTexture.texture]));
	}
}