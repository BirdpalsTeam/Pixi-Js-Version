class Racket extends PIXI.Sprite{
	constructor(){
		super(resources.racket.texture);
		this.anchor.set(0.5, 0.5);
		this.collider = new Circle(this.x, this.y, 50);
		this.distanceToBall;
		this.speedX = 0;
		this.speedY = 0;
		this.shotId = 0;
	}

	updateSpeed(evt){
		this.speedX += Math.abs(evt.movementX);
		this.speedY += Math.abs(evt.movementY);
	}
	
	updateSize(){
		this.scale.set(this.y / 400, this.y / 400);
	}

	hitBall(ball){
		if(this.collider.collides(ball.collider) == true){
			if(this.speedY >= 150){
				if(this.y < ball.y){
					this.shotId = 3; //Powerfull spin shot
					console.log('Powerfull spin shot');
				}else{
					this.shotId = 2; //Powerfull shot
					console.log('Powerfull shot')
				}
			}else{
				if(this.y < ball.y){
					this.shot = 1; //Normal spin shot
					console.log('Normal spin shot');
				}else{
					this.shot = 0; //Normal shot
					console.log('Normal shot');
				}
			}
		}
	}
}

class Tabble extends PIXI.Sprite{
	constructor(){
		super(resources.tabble.texture);
		this.anchor.set(0.5, 0.5);
		this.x = 500;
		this.y = 300;
	}
}

class Ball extends PIXI.Sprite{
	constructor(){
		super(resources.ball.texture);
		this.anchor.set(0.5, 0.5);
		this.x = 500;
		this.y = 350;
		this.collider = new Circle(this.x, this.y, 36);
		app.ticker.add((delta)=>{
			this.scale.set(this.y / 600, this.y / 600);
		})
	}
}

let racket = new Racket();
let tabble = new Tabble();
let ball = new Ball();

app.stage.on('pointermove', (evt)=>{
	racket.x = evt.data.global.x;
	if(evt.data.global.y > 200) racket.y = evt.data.global.y;
	racket.collider.x = racket.x;
	racket.collider.y = racket.y;
	let radian = Math.PI / 180;
	//How does it work? I honestly don't know :/
	//My guess is that we divide the distance between the racket and the center of the canvas to a number that indicates the radius of the rotation
	//Then we convert this distance to radians by getting the minimum value between the distance and the maximum angle.
	//And we get the maximum value between the angle if it was for the right and the maximum angle of the left.
	//Math.max(Math.min((racket.x - (canvas.width / 2)) / 200, 90 * radian), -90 * radian)
	let angleToLook = Math.max(Math.min((racket.x - 500) / 200, 90 * radian), -90 * radian);
	racket.rotation = angleToLook;
	racket.updateSize();
	racket.hitBall(ball);
	racket.updateSpeed(evt.data.originalEvent);
})
app.stage.addChild(tabble);
app.stage.addChild(ball);
app.stage.addChild(racket);

let getBatsSpeed = setInterval(function(){
	//console.log(`Speed X: ${racket.speedX}px/s, Y: ${racket.speedY}px/s`);
	racket.speedX = racket.speedY = 0;
}, 200);