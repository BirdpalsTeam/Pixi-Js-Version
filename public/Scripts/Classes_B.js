class Bird extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.EMPTY);

    const birdResource = resources.bird;
    const frame = 4;

    this.frame = frame;

    // Load sprites
    this.sortableChildren = true;
    let layer = 12;

    for (let sprite of birdResource.data.sprites) {
      let spriteObject = new PIXI.Sprite(
        birdResource.textures[`${sprite}_${frame}.png`]
      );
      spriteObject.name = sprite;
      spriteObject.zIndex = layer;
      spriteObject.position.set(
        birdResource.data.frames[`${sprite}_${frame}.png`].position.x,
        birdResource.data.frames[`${sprite}_${frame}.png`].position.y
      );
      spriteObject.anchor.set(0.5, 0.5);
      this.addChild(spriteObject);
      layer--;
    }
  }

  changeColor(color, bodyParts = null, epsilon = 0.7) {
    // Default body is the default body parts to recolor.
    function defaultBody(bodyPart) {
      if (
        bodyPart.name === 'body' ||
        bodyPart.name === 'wings' ||
        bodyPart.name === 'hair'
      ) {
        return bodyPart;
      }
    }

    this.children.filter(defaultBody).forEach((part) => {
      part.filters = [new BirdColorReplacement(0x3db0ff, color, epsilon)];
    });

    if (bodyParts !== null) {
      for (let part in bodyParts) {
        let originalColor;
        let partColor = color;

        if (
          bodyParts[part].originalColor !== undefined &&
          bodyParts[part].color !== undefined
        ) {
          originalColor = bodyParts[part].originalColor;
          partColor = bodyParts[part].color;
        }

        this.getChildByName(part).filters = [
          new BirdColorReplacement(originalColor, partColor, epsilon),
        ];
      }
    }
  }
}
