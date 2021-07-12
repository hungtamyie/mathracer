class Entity {
    constructor(x, y, radius, sX, sY, sW, sH, dW, dH, dO, bounce){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sX = sX;
        this.sY = sY;
        this.sW = sW;
        this.sH = sH;
        this.dW = dW;
        this.dH = dH;
        this.dO = dO;
        this.bounce = bounce;
        this.shake = 0;
        this.shakeDirection = 1;
        this.shakeCounter = 0;
        this.shakeScale = 0.05;
        this.shakePower = 25;
    }
    
    startShake(power){
      this.shakeCounter = power * this.shakePower;
    }
    
    updateShake(delta){
      this.shake += this.shakeDirection;
      if (this.shake < -10) {
        this.shake = -10;
        this.shakeDirection = 1;
      }
      if (this.shake > 10) {
        this.shake = 10;
        this.shakeDirection = -1;
      }
      
      this.shakeCounter -= 1;
      if (this.shakeCounter < 0) {
        this.shakeCounter = 0;
      }
    }
    
    getY(){
      return this.y;
    }
}

class TireBlack extends Entity {
    constructor(x, y){
        super(x, y, 18, 240*2, 0, 240, 240, 50, 50, -40, 1.05);
    } 
}

class TireWhiteRed extends Entity {
    constructor(x, y){
        super(x, y, 18, 240*4, 0, 240, 240, 50, 50, -40, 1.05);
    } 
}

class TireRedWhite extends Entity {
    constructor(x, y){
        super(x, y, 18, 240*3, 0, 240, 240, 50, 50, -40, 1.05);
    } 
}

class BarrierLeft extends Entity {
    constructor(x, y){
        super(x, y, 18, 240*0, 0, 240, 240, 50, 50, -40, 1.01);
    }
    
    startShake(power){
      this.shakeCounter = 0;
    }
}
class BarrierRight extends Entity {
    constructor(x, y){
        super(x, y, 18, 240*1, 0, 240, 240, 50, 50, -40, 1.01);
    }
    
    startShake(power){
      this.shakeCounter = 0;
    }
}