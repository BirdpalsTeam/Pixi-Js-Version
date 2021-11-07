class Player extends PIXI.Sprite{
	constructor(player) {
		super(resources.bird_blue.textures['4.png']);
		this.id = player.id;
		this.username = player.username;
		this.isMoving = player.isMoving;
		this.x = player.x;
		this.y = player.y;
		this.anchor.x = 0.5;
		this.anchor.y = 1;
		this.width = player.width;
		this.heigth = player.heigth;
		this.mouseX = player.mouseX;
		this.mouseY = player.mouseY;
		this.movePlayerInterval;
		this.isDev = player.isDev;
		this.canMove = true;
		this.canDrawUsername = true;
		this.bubble = this.addChild(new PIXI.Sprite(resources.bubble_message.texture));
		this.bubble.visible = false;
		this.bubble.x = -84;
		this.bubble.y = -182;
		this.bubble.scale.set(0.8, 0.8)
		this.messageTimeout;
		//items
		this.items = player.items;
		this.id == sessionStorage.playerId ? this.local = true : this.local = false;
	}

	whereToLook(){
		let dx = this.mouseX - this.x;
		let dy = this.mouseY - this.y;

		let angleToLook = Math.atan2(dy, dx) * 180 / Math.PI;

		let lookingInt = 1;

		if(angleToLook < 0) angleToLook += 360;

		if(angleToLook > 70 && angleToLook<= 110){	//look to the front
			lookingInt = 4;
		}else if (angleToLook > 110 && angleToLook <= 220){//look to the left
			lookingInt = 6;
		}else if(angleToLook > 220 && angleToLook <= 260){ //look to the upper left
			lookingInt = 2;
		}else if(angleToLook > 260 && angleToLook <= 281 ){//look to the back
			lookingInt = 1;
		}else if(angleToLook > 281 && angleToLook <= 330){//look to the upper right
			lookingInt = 5;
		}else if(angleToLook > 330 && angleToLook <= 360 || angleToLook <= 70){//look to the right
			lookingInt = 3;
		}
		this.texture = resources.bird_blue.textures[`${lookingInt}.png`];
	}

	move(){
		if(this.canMove == true){
			if(this.isMoving == false){
				this.movePlayer();
			}else{
				this.isMoving = false;
				this.movePlayerInterval.destroy();
				this.movePlayer();
			}
			this.whereToLook();
		}	
	}

	movePlayer(){
		this.isMoving = true;
		let dx = this.mouseX - this.x;
		let dy = this.mouseY - this.y;
		
		let angleToMove = Math.atan2(dy,dx);

		let speed = 4;

		let velX = Math.cos(angleToMove) * speed;
		let velY = Math.sin(angleToMove) * speed;
		let timeToPlayerReachDestination = Math.floor(dx/velX);
		this.movePlayerInterval = new PIXI.Ticker();
		this.movePlayerInterval.start();
		this.movePlayerInterval.add((delta)=>{
			this.x += velX * delta;
			this.y += velY * delta;
			timeToPlayerReachDestination--;
			if(timeToPlayerReachDestination <= 0){
				this.isMoving = false;
				this.movePlayerInterval.destroy();
			}
		})

	}

	drawBubble(){
		if(this.message != undefined){
			let bitmapText = new PIXI.BitmapText(this.message,{
				fontName: 'Arial',
				fontSize: 24,
				align: 'center',
				maxWidth: 2,
				tint: 0x000000
			});
			console.log(bitmapText.maxWidth);
			this.bubble.addChild(bitmapText);
			this.bubble.visible = true;
			this.hideBubble();
		}
	}

	hideBubble(){
		this.messageTimeout = setTimeout(() => {
			clearTimeout(this.messageTimeout);
			this.message = undefined;
			this.bubble.visible = false;
			this.bubble.removeChildAt(0);
		}, 10000);
	}
}