class Item extends PIXI.Sprite {
  constructor(item, frame) {
    super(resources.items.textures[`${item}_4.png`]);
    this.anchor.set(0.5, -0.5);
    this.item = item;
    this.frame = frame;
    this.itemData = resources.items.data;
    this.y = this.itemData.frames[`${item}_${frame}.png`].position.y;
    this.x = this.itemData.frames[`${item}_${frame}.png`].position.x;
  }

  updateFrame(frame) {
    if (`${this.item}_${frame}.png` in resources.items.textures) {
      if (this.visible === false) {this.visible = true}
      this.texture = resources.items.textures[`${this.item}_${frame}.png`];
      this.y = this.itemData.frames[`${this.item}_${frame}.png`].position.y;
      this.x = this.itemData.frames[`${this.item}_${frame}.png`].position.x;
    }else{
      this.visible = false;
    }
    this.frame = frame;
  }
}
