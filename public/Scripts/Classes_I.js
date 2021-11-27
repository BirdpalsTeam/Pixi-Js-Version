class Inventory extends Book{
	constructor(){
		super(localPlayer);
	}

	customOpen(){
		this.drawUsername();
		this.drawGrid();
		//this.drawArrows();
		this.drawBio();
		this.getInventory();
	}

	customClose(){
		this.cells.forEach((cell) =>{
			if(cell.item !== undefined){
				this.items[this.items.indexOf(cell.item)].CustomData.isEquipped = cell.isSelected;
			}
		})

		let bio = document.getElementById('bioInput');
		if(bio.hidden == false){
			if(bio.value !== ''){
				command('/changeBio', bio.value);
				localPlayer.bio = bio.value;
			} 
			bio.hidden = true;
			bio.value = '';
		}
		//command('/updateInventory', this.items);
	}

	drawUsername(){
		let usernameText = new PIXI.BitmapText(this.username,{
			fontName: 'Caslon Antique',
			fontSize: 40,
			align: 'center',
			tint: 0x615f5b
		});
		usernameText.anchor.x = 0.5;
		usernameText.x = 235;
		usernameText.y = 35;
		this.addChild(usernameText)
	}

	getInventory(){
		PlayFabClientSDK.GetUserInventory({SessionTicket: sessionStorage.ticket}, (result, error) =>{
			if(result !== null){
				this.items = result.data.Inventory;
				for(let i = 0; i < 16; i++){
					if(this.items[i] !== undefined){
						this.cells[i].item = this.items[i];
						this.cells[i].loadIcons(this.items[i]);
						this.cells[i].interactive = true;
						this.cells[i].buttonMode = true;
					}else{
						this.cells[i].stopLoadingAnimation();
					}
					
				}
			}else if(error !== null){
				console.log(error);
			}
		})
	}

	drawGrid(){
		let pastX = 455;
		let pastY = 102;
		let squareWidth = 85;
		let squareHeight = 76.25;
		this.cells = new Array();
		for(let i = 0; i < 16; i++){
			if(i % 4 == 0 && i != 0){
				pastX = 455;
				pastY += squareHeight;
			}
			let cell = new Cell(pastX, pastY, squareWidth, squareHeight, 2);
			this.cells.push(cell);
			this.addChild(cell);
			cell.loadingAnimation();
			pastX += squareWidth;
		}
		this.drawGridBound();
	}

	drawGridBound(){
		this.graphics = new PIXI.Graphics();
		this.graphics.lineStyle(5, 0x000000);
		this.graphics.drawRoundedRect(455, 102, 340, 305, 2)
		this.addChild(this.graphics);
	}

	drawArrows(){
		this.addChild(new Arrow(740 , 420), new Arrow(505, 420, true));
	}

	drawBio(){
		this.addChild(new Bio(340, 425));
	}

	hideInventory(){
		this.cells.forEach((cell) =>{
			cell.visible = false;
		})
	}

	redrawInventory(){
		this.cells.forEach((cell) =>{
			cell.visible = true;
		})
	}
}

class Cell extends PIXI.Graphics{
	constructor(x, y, width, height, round){
		super();
		this.nx = x;
		this.ny = y;
		this.nw = width;
		this.nh = height;
		this.nr = round;
		this.hitArea = new PIXI.Rectangle(this.nx, this.ny, this.nw - 4, this.nh - 4);
		this.isFastRect = true;
		this.isSelected = false;

		this.lineStyle(5, 0x000000);
		this.drawRoundedRect(this.nx, this.ny, this.nw, this.nh, this.nr);
		
		this.loadingSprite = new PIXI.Sprite(resources.loading_i.texture);
		this.loadingSprite.anchor.set(0.5, 0.5);
		this.loadingSprite.scale.set(0.7, 0.7);
		this.loadingSprite.x = x + 42.5;
		this.loadingSprite.y = y + 38;
		this.loadingSprite.ticker = new PIXI.Ticker();
		
		
		this.iconLoader = new PIXI.Loader();

		this.iconLoader.onComplete.add((e) =>{
			PIXI.Loader.shared.resources[this.item.ItemId] = e.resources[this.item.ItemId];
			this.stopLoadingAnimation();
			this.addIcon();
		});
		this.iconLoader.onError.add((e) =>{
			console.error(`There was an error when loading: ${e.message}`);
		});

		this.on('pointerover', (event) => {
			this.fillGray();
			if(this.isSelected == true) this.icon.tint = 0x575757;
		});
		this.on('pointerout', (event) =>{
			this.clearGray();
			if(this.isSelected == true){
				//redraws the selected gray color
				this.fillGray();
			}
		})
		this.on('pointerdown', (event) => {
			if(this.isSelected == false){
				this.fillGray();
				this.isSelected = true;
			}else{
				this.isSelected = false;
				this.clearGray();
			}
		});
	}

	loadingAnimation(){
		this.loadingSprite.ticker.add((delta) =>{
			this.loadingSprite.rotation += 0.1 * delta;
		});
		this.loadingSprite.ticker.start();
		this.addChild(this.loadingSprite);
	}

	stopLoadingAnimation(){
		this.loadingSprite.ticker.destroy();
		this.loadingSprite.visible = false;
	}

	loadIcons(item){
		if(item.CustomData.isEquipped == 'true') this.isSelected = true;
		if(PIXI.Loader.shared.resources[item.ItemId] == undefined){
			this.iconLoader.add(item.ItemId, `${spritesSrc}items/${item.ItemClass}/${item.ItemId}_icon.png`);
			this.iconLoader.load();
		}else{
			this.stopLoadingAnimation();
			this.addIcon();
		}
	}

	addIcon(){
		this.icon = new PIXI.Sprite(PIXI.Loader.shared.resources[this.item.ItemId].texture);
		this.icon.x = this.nx;
		this.icon.y = this.ny;
		if(this.isSelected == true) this.fillGray();
		this.addChild(this.icon);
	}

	fillGray(){
		this.icon.tint = 0xA3A3A3;
		this.beginFill(0x0000, 0.3);
		this.drawRoundedRect(this.nx, this.ny, this.nw, this.nh, this.nr);
		this.endFill();
	}

	clearGray(){
		this.icon.tint = 0xFFFFFF;
		this.clear();
		this.lineStyle(5, 0x000000);
		this.drawRoundedRect(this.nx, this.ny, this.nw, this.nh, this.nr);
	}
}

class Arrow extends PIXI.Sprite{
	constructor(x, y, flip){
		super(resources.arrow.texture);
		this.x = x;
		this.y = y;
		if(flip == true){this.scale.x = -1;}
		this.interactive = true;
		this.buttonMode = true;
		this.on('pointerover', (event) => {this.tint = 0xA3A3A3});
		this.on('pointerout', (event) => {this.tint = 0xFFFFFF});
	}
}

class Bio extends PIXI.Sprite{
	constructor(x, y){
		super(resources.bio_button.texture);
		this.x = x;
		this.y = y;
		this.interactive = true;
		this.buttonMode = true;
		this.isOpen = false;
		this.on('pointerover', (event) => {this.tint = 0xA3A3A3});
		this.on('pointerout', (event) => {this.tint = 0xFFFFFF});
		this.on('pointerdown', (event) => {
			this.parent.hideInventory();
			this.isOpen == false ? this.open() : this.close();
		});
		this.bio = document.getElementById('bioInput');
	}

	open(){
		this.isOpen = true;
		this.bio.hidden = false;
		if(this.parent.bio !== undefined) this.bio.value = this.parent.bio;
	}

	close(){
		this.isOpen = false;
		this.bio.hidden = true;
		this.parent.redrawInventory();
	}
}