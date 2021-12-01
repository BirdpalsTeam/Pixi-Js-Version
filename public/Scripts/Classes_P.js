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
		this.height = player.height;
		this.mouseX = player.mouseX;
		this.mouseY = player.mouseY;

		this.movePlayerInterval;
		this.isDev = player.isDev;
		this.canMove = true;
		this.canDrawUsername = true;
		this.collider = new Point(this.x, this.y);
		//Bubble
		this.bubble = this.addChild(new PIXI.Sprite(resources.bubble_message.texture));
		this.bubble.visible = false;
		this.bubble.x = -84;
		this.bubble.y = -182;
		this.bubble.scale.set(0.8, 0.8)
		this.messageTimeout;
		//items
		this.items = player.items;
		this.id == sessionStorage.playerId ? this.local = true : this.local = false;
		//card
		this.bio = player.bio;
		switch(this.local){
			case true:
				this.drawUsername('LUsernameFont');
				break;
			case false:
				this.drawUsername('NUsernameFont');
				this.interactive = true;
				this.buttonMode = true;
				this.on('pointerdown', (event) => {
					this.playerCard = new PlayerCard(this);
					this.playerCard.open()
				});
				break;
			case friend:
				break;
		}
		this.zIndex = this.y;
		this.whereToLook();
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
		let totalTime = timeToPlayerReachDestination;
		let rest = timeToPlayerReachDestination % 20;
		let collided = false;
		
		this.movePlayerInterval = new PIXI.Ticker();
		
		this.movePlayerInterval.add((delta)=>{
			if(timeToPlayerReachDestination <= 0 || collided == true){
				this.isMoving = false;
				return this.movePlayerInterval.destroy();
			}

			let newX = this.x + velX * delta;
			let newY = this.y + velY * delta;
			this.collider.x = newX;
			this.collider.y = newY;
			let collisions = 0;
			collisionArray.forEach((polygon) =>{
				if(this.collider.collides(polygon) == false){
					collisions += 1;
				}
			})
			if(collisions == collisionArray.length){
				this.isMoving = false;
				this.collider.x = this.x;
				this.collider.y = this.y;
				triggers.forEach(function(tempTrigger){ //Goes through each trigger to see if the player is within it
					if(localPlayer.y >= tempTrigger[1] && localPlayer.y <= tempTrigger[3] && localPlayer.x >= tempTrigger[0] && localPlayer.x <= tempTrigger[2]){
						currentRoom.activateTrigger(tempTrigger);
					}
				});
				collided = true;
				this.anchor.y = 1;
				return this.movePlayerInterval.destroy();
			}
			if(collided == false){
				this.x = newX;
				this.y = newY;
				this.anchor.y = littleJump(timeToPlayerReachDestination);
				timeToPlayerReachDestination--;
				this.zIndex = this.y;
			}
		})
		
		this.movePlayerInterval.start();

		function littleJump(currentDuration){
			let y;
			if(currentDuration > 20){
				//Modular equation of sine graph
				//f(x) = |0.3 * sin( ((2 * π) / 40) * x)| + 0.9
				y = Math.abs(0.3 * Math.sin( ((2 * Math.PI) / 40) * currentDuration) ) + 0.9;
			}else if(currentDuration <=20 || currentDuration == rest){
				//Vertical launch equation
				//y = 0.1 * x - 5 / 2
				y = (1 / (0.1 * currentDuration - 5 * Math.pow(currentDuration, 2)) ) + 1.2;
			}
			return y;
		}
	}

	drawBubble(){
		if(this.message != undefined){
			this.message = wordwrapjs.wrap(this.message, {width: 19, break: true});
			let bitmapText = new PIXI.BitmapText(this.message,{
				fontName: 'Arial',
				fontSize: 24,
				align: 'center',
				tint: 0x000000
			});

			//Set original numbers
			this.bubble.height = 75.2;
			this.bubble.width = 209.6;
			this.bubble.y = -182;
			this.bubble.x = -84;

			//Make some configs
			bitmapText.anchor.set(0.5, 0.5);
			bitmapText.x += 2.4*(this.bubble.width / 4);
			bitmapText.y = 27;
			
			this.bubble.addChild(bitmapText);

			//Stretch bubble in case of bigg messages
			if(bitmapText.height >= this.bubble.height - 5 || bitmapText.height >= this.bubble.width - 5){
				let heightDifference = bitmapText.height - (this.bubble.height - 5);
				let widthDifference = bitmapText.width - this.bubble.width;
				this.bubble.height += heightDifference + 20;
				this.bubble.width += widthDifference + 20;
				bitmapText.height -= heightDifference + 5;
				bitmapText.width -= widthDifference + 5;
				bitmapText.y += 7;
				bitmapText.x += 7;
				this.bubble.y -= this.bubble.height - 75.2;
				this.bubble.x -= this.bubble.width - 209.6;
			}
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

	drawUsername(fontName){
		let usernameText = new PIXI.BitmapText(this.username,{
			fontName: fontName,
			align: 'center'
		});
		usernameText.anchor.set(0.5, 0.2);
		this.addChild(usernameText);
	}
}