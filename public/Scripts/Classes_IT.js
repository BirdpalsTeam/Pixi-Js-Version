class Item extends PIXI.Sprite{
	constructor(item){
		super(resources.items.textures[`${item}_4.png`]);
		this.anchor.set(0.5, 0.5);
		this.item = item;
		this.itemData = resources.items.data;
		this.y = this.itemData.frames[`${item}_4.png`].position.y;
		this.x = this.itemData.frames[`${item}_4.png`].position.x;
	}

	updateFrame(frame){
		this.texture = resources.items.textures[`${this.item}_${frame}.png`];
		this.y = this.itemData.frames[`${this.item}_${frame}.png`].position.y;
		this.x = this.itemData.frames[`${this.item}_${frame}.png`].position.x;
	}
}