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
		let collided, willCollide;
		
		function predictCollision(x1, y1, x2, y2, x, y) {
			//x1 and y1 are bottom-left and x2 and y2 are top-right
			if (x > x1 && x < x2 && y > y1 && y < y2){
				willCollide = false;
			}else{
				willCollide = true;
			}
		}

		predictCollision(predictArray[0],predictArray[1],predictArray[2],predictArray[3],this.mouseX,this.mouseY);

		this.movePlayerInterval = new PIXI.Ticker();

		this.movePlayerInterval.add((delta)=>{
			if(willCollide == true){
				for(let i = 0; i < collisionArray.length; i+=2){
					if(timeToPlayerReachDestination <= 0) return collided = true;
					if(this.x + velX <= collisionArray[i] + roomCollCellWidth && this.x + velX >= collisionArray[i]){
						if(this.y + velY <= collisionArray[i + 1] + roomCollCellHeight && this.y + velY >= collisionArray[i + 1]){
							this.isMoving = false;
							triggers.forEach(function(tempTrigger){ //Goes through each trigger to see if the player is within it
								if(localPlayer.y >= tempTrigger[1] && localPlayer.y <= tempTrigger[3] && localPlayer.x >= tempTrigger[0] && localPlayer.x <= tempTrigger[2]){
									currentRoom.activateTrigger(tempTrigger);
								}
							});
							this.movePlayerInterval.destroy();
						}
					}
				}
			}

			this.x += velX * delta;
			this.y += velY * delta;
			timeToPlayerReachDestination--;
			this.zIndex = this.y;
			if(timeToPlayerReachDestination <= 0){
				this.isMoving = false;
				this.movePlayerInterval.destroy();
			}
		})

		this.movePlayerInterval.start();
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
			bitmapText.anchor.set(0.5, 0.5);
			bitmapText.x += 2.4*(this.bubble.width / 4);
			bitmapText.y = 27;
			if(bitmapText.textWidth > bitmapText.maxWidth){
				
			}
			console.log(bitmapText);
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

	drawUsername(fontName){
		let usernameText = new PIXI.BitmapText(this.username,{
			fontName: fontName,
			align: 'center'
		});
		usernameText.anchor.set(0.5, 0.2);
		this.addChild(usernameText);
	}
}

class PlayerCard extends PIXI.Sprite{
	constructor(player){
		super(resources.book.texture);
		this.visible = false;
		this.x = 50;
		this.y = 40;
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
	}

	open(){
		book.addChild(this);
		localPlayer.canMove = false;
		this.visible = true;
		this.drawRectangle();
		this.drawBio();
		this.drawUsername();
	}

	close(){
		this.visible = false;
		setTimeout(() => {
			localPlayer.canMove = true;
		}, 10);
		this.destroy();
	}

	drawRectangle(){
		this.graphics = new PIXI.Graphics();
		this.graphics.lineStyle(5, 0x000000);
		this.graphics.drawRoundedRect(455, 102, 340, 305, 2)
		this.addChild(this.graphics);
	}

	drawBio(){
		let bioText = new PIXI.Text(this.bio,{
			fontName: 'Caslon_font',
			align: 'center'
		});
		bioText.x = 600;
		bioText.y = 140;
		this.graphics.addChild(bioText);
	}

	drawUsername(){
		let usernameText = new PIXI.BitmapText(this.username,{
			fontName: 'Caslon Antique',
			align: 'center'
		});
		this.addChild(usernameText)
	}
}