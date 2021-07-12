class Particle {
    constructor(x, y, mx, my, lifetime, sX, sY, sN, drawSize){
        this.x = x;
        this.y = y;
        this.mx = mx;
        this.my = my;
        this.lifetime = lifetime;
        this.life = 0;
        this.sX = sX;
        this.sY = sY;
        this.sW = 64;
        this.sH = 64;
        this.sN = sN;
        this.drawSize = drawSize;
        this.drawIndex = 0;
        this.drawOffset = -20;
    }
    
    update(delta){
        this.x += this.mx*delta;
        this.y += this.my*delta;
        this.mx *= Math.pow(0.99, delta);
        this.my *= Math.pow(0.99, delta);
        this.drawIndex = Math.floor(this.life/this.lifetime * this.sN);
        this.life += delta;
    }
}

