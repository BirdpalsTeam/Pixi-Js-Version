class Item extends PIXI.Sprite {
  constructor(item={}, frame=4) {
    super(resources.items.textures[`${item}_${frame}.png`]);
    this.anchor.set(0.5, -0.5);
    this.ItemId = item.ItemId;
    this.ItemClass = item.ItemClass;
    this.frame = frame;
    this.itemData = resources.items.data;
    this.y = this.itemData.frames[`${item.ItemId}_${frame}.png`].position.y;
    this.x = this.itemData.frames[`${item.ItemId}_${frame}.png`].position.x;
  }

  updateFrame(frame) {
    if (`${this.ItemId}_${frame}.png` in resources.items.textures) {
      if (this.visible === false) {this.visible = true}
      this.texture = resources.items.textures[`${this.ItemId}_${frame}.png`];
      this.y = this.itemData.frames[`${this.ItemId}_${frame}.png`].position.y;
      this.x = this.itemData.frames[`${this.ItemId}_${frame}.png`].position.x;
    }else{
      this.visible = false;
    }
    this.frame = frame;
  }
}
