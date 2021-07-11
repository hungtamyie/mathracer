class Entity {
    constructor(x, y, r, sX, sY, sW, sH, dW, dH){
        this.x = x;
        this.y = y;
        this.r = r;
        this.sX = sX;
        this.sY = sY;
        this.sW = sW;
        this.sH = sH;
        this.dW = dW;
        this.dH = dH;
        this.shake = 0;
        this.shakeCounter = 0;
    }
}

class TireBlack extends Entity {
    constructor(x, y){
        super(x, y, 0, 240*2, 0, 240, 240, 10, 10);
        console.log(this.sX)
    }
}
class Animal{
	constructor(x, y){
  	this.x = x;
    this.y = y;
  }
}

class Bird extends Animal {
	constructor(a){
  	super(a, 3);
  }
}

let bird = new Bird(1);
console.log(bird);