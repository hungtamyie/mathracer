var canvas;
var ctx;
var racer;
var spriteSheet = false;
window.onload = function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    racer = new Racer();
    var image = new Image();
    image.onload = function () {
        // draw the image into the canvas
        spriteSheet = image;
    }
    image.src = 'carsheet.png';
    
    
    tick();
}

function tick(){
    ctx.clearRect(0,0,1500,1000)
    drawRacer();
    takeInputs();
    updateRacer();
    
    window.requestAnimationFrame(tick);
}

class Racer {
    constructor() {
        this.pos = new Vector(100,100);
        this.dir = new Vector(1,0);
        this.vel = new Vector(0,0);
        this.acc = new Vector(0,0)
        this.drifting = false;
        
        this.accelerating = 0;
        this.turning = 0;
        this.handbreak = 0;
        
        this.POWER = 0.1;
        this.TOP_SPEED = 4;
    }
}

function drawRacer(){
    ctx.fillStyle = "black"
    ctx.beginPath();
    ctx.ellipse(racer.pos.x, racer.pos.y, 20, 20, 0, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(racer.pos.x + racer.dir.x*30, racer.pos.y + racer.dir.y*30, 5, 5, 0, 0, Math.PI*2);
    ctx.fill();
}

function updateRacer(){
    
    if (racer.accelerating == 1) {
        racer.vel.addTo(racer.dir.multiply(racer.POWER / (racer.vel.getMagnitude()*2||1)));
    }
    if (racer.accelerating == 0) {
        racer.vel.divideBy(1.001)
    }
    if (racer.accelerating == -1) {
        racer.vel.divideBy(1.05)
    }
    
    if (racer.turning != 0) {
        
        let turningRadius = 60 + racer.vel.getMagnitude()**2 * 4;
        if (racer.handbreak) {
            turningRadius /= 1.5;
        }
        
        let tan = racer.dir.copy();
        tan.normalize();
        tan.setDirection(tan.getDirection() + 90 * Math.PI/180 * racer.turning);
        let circleX = racer.pos.x + tan.x*turningRadius*2;
        let circleY = racer.pos.y + tan.y*turningRadius*2;
        
        ctx.beginPath();
        ctx.ellipse(circleX, circleY, turningRadius*2, turningRadius*2, 0, 0, Math.PI*2);
        ctx.stroke();
        
        let projFor = racer.dir.copy();
        projFor.normalize();
        projFor.multiplyBy((racer.vel.dot(projFor)) / ((projFor.getMagnitude() ** 2)||1));
        
        let circumference = turningRadius * 2 * Math.PI;
        let percentageTraveled = racer.vel.getMagnitude()/circumference;
        
        let currentNormal = new Vector(racer.pos.x - circleX, racer.pos.y - circleY);
        currentNormal.setDirection(currentNormal.getDirection() + percentageTraveled * 2 * Math.PI * racer.turning)
        let targetPos = new Vector(circleX + currentNormal.x, circleY + currentNormal.y)
        
        /*ctx.fillStyle = "red"
        ctx.beginPath();
        ctx.ellipse(targetPos.x, targetPos.y, 5, 5, 0, 0, Math.PI*2);
        ctx.fill();
        console.log(currentNormal.getDirection());*/
        
        let idealLine = new Vector(targetPos.x - racer.pos.x,targetPos.y - racer.pos.y);
        racer.dir.setDirection(idealLine.getDirection());
        racer.vel.setDirection(racer.dir.getDirection());
        
        racer.vel.setMagnitude(racer.vel.getMagnitude() - 0.1 / turningRadius)
    }
    
    if (racer.vel.getMagnitude() > racer.TOP_SPEED) {
        racer.vel.setMagnitude(racer.TOP_SPEED + (racer.vel.getMagnitude()-racer.TOP_SPEED)/2)
    }
    racer.pos.addTo(racer.vel);
}

function takeInputs(){
    if (keys.shift) {
        racer.handbreak = true;
    }
    else {
        racer.handbreak = false;
    }
    
    if (keys.a && !keys.d) {
        racer.turning = -1;
    }
    else if (keys.d && !keys.a) {
        racer.turning = 1;
    }
    else {
        racer.turning = 0;
    }
    
    if (keys.w) {
        racer.accelerating = 1;
    }
    else if (keys.s) {
        racer.accelerating = -1;
    }
    else {
        racer.accelerating = 0;
    }
}

var keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

document.onkeydown = function(e){
    key = e.key.toLowerCase();
    keys[key] = true;
}

document.onkeyup = function(e){
    key = e.key.toLowerCase();
    keys[key] = false;
}