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
    ctx.clearRect(0,0,1500,1000) //resets canvas
    drawIsoLines();
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
        this.acc = 0;
        this.steering = 0;
        this.drifting = false; //not in use
        
        this.accelerating = 0;
        this.turning = 0;
        this.turnDuration = 0;
        
        this.maxAccel = 0.1;
    }
}

function drawRacer(){
    if(spriteSheet) {
        for(let i=0; i<5; i++) {
            let angle = racer.dir.getDirection(); //direction of VELOCITY
            let driftAngle = calculateDriftAngle(racer.turnDuration); //direction of car sprite
            rotateRacer(angle + driftAngle);
            ctx.fillRect(racer.pos.x - 23, racer.pos.y - 13, 46, 30);
            
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(racer.pos.x, racer.pos.y);
            ctx.lineTo(racer.pos.x + 20, racer.pos.y);
            ctx.stroke();

            //ctx.drawImage(spriteSheet, 256 * i, 0, 256, 256, racer.pos.x-30, racer.pos.y-45 - i*2, 60, 60);
            ctx.setTransform(1, 0, 0, 1, 0, 0,); //undo canvas rotation
            ctx.strokeStyle = "gray";
            ctx.lineWidth = 1;
        }
    }
}
function calculateDriftAngle(turnDuration) {
    let vel = racer.vel.getMagnitude();
    if((vel * (turnDuration/100)) / 2 == (45 * Math.PI / 180)) { //reached max angle
        return 45 * Math.PI / 180;
    }else { //continue increasing angle
        return (vel * (turnDuration/500)) / 2;
    }
    
}

function updateRacer(){
    let grip = 10;
    
    //deal with acceleration
    if (racer.accelerating == 1) {
        racer.acc += 0.01;
        if (racer.acc > racer.maxAccel) {
            racer.acc = racer.maxAccel;
        }
    }
    else if (racer.accelerating == 0) {
        racer.acc -= 0.005;
        if (racer.acc < 0) {
            racer.acc = 0;
        }
    }
    else if (racer.accelerating == -1) {
        racer.acc -= 0.01;
        if (racer.acc < -racer.maxAccel/3) {
            racer.acc = -racer.maxAccel/3;
        }
    }
    
    //deal with steering and handling
    if (racer.turning == 1) {
        racer.steering += 0.001;
        racer.turnDuration += 2;
        if (racer.steering > 0.02) {
            racer.steering = 0.02;
        }
        if(racer.turnDuration > 300) {
            racer.turnDuration = 300; //max value
        }
    }
    else if (racer.turning == -1) {
        racer.steering -= 0.001;
        racer.turnDuration -= 2;
        if (racer.steering < -0.02) {
            racer.steering = -0.02;
        }
        if(racer.turnDuration < -300) {
            racer.turnDuration = -300;
        }
    }
    else {
        racer.steering = 0;
        if(racer.turnDuration > 0) {
            racer.turnDuration -= 5;
        }else if(racer.turnDuration < 0) {
            racer.turnDuration += 5;
        }
    }
    
    if (racer.vel.getMagnitude() > 0) {
        racer.dir.setDirection(racer.dir.getDirection() + racer.steering);
    }
    
    //Apply all forces to racer velocity
    //---------------------------
    
    let drag = racer.vel.copy();
    drag.setMagnitude((racer.vel.getMagnitude()**4)/2000)
    racer.vel.subtractFrom(drag)
    
    racer.vel.addTo(racer.dir.multiply(racer.acc));
    
    let velNormalized = racer.vel.copy();
    velNormalized.normalize();
    
    let projFor = racer.dir.copy();
    projFor.normalize();
    projFor.multiplyBy((velNormalized.dot(projFor)) / ((projFor.getMagnitude() ** 2)||1));
    
    let projTan = racer.dir.copy();
    projTan.normalize();
    projTan.setDirection(projTan.getDirection() + 90 * Math.PI/180);
    projTan.multiplyBy((velNormalized.dot(projTan)) / ((projTan.getMagnitude() ** 2)||1));
    
    //draws vectors
    ctx.beginPath();
    ctx.moveTo(racer.pos.x, racer.pos.y);
    ctx.lineTo(racer.pos.x + projFor.x * 100, racer.pos.y + projFor.y * 50);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(racer.pos.x, racer.pos.y);
    ctx.lineTo(racer.pos.x + projTan.x * 100, racer.pos.y + projTan.y * 50);
    ctx.stroke(); 
    
    let speedLoss = racer.vel.getMagnitude();
    racer.vel.addTo(projTan.multiply(-0.01*(grip)));
    speedLoss -= racer.vel.getMagnitude();
    if (speedLoss < .001) {
        speedLoss = 0;
    }
    else {
        racer.vel.addTo(racer.dir.multiply(speedLoss * projFor.getMagnitude()));
    }
    
    //Apply velocity to racer position
    racer.pos.x += racer.vel.x;
    racer.pos.y += racer.vel.y/2;
    
}

function drawIsoLines(){
    ctx.strokeStyle = "grey";
    for (var i = 0; i < 25; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0 + i * 50 - 500);
        ctx.lineTo(700, 0 + i * 50 + 350 - 500);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 0 + i * 50 + 350 - 500);
        ctx.lineTo(700, 0 + i * 50 - 500);
        ctx.stroke();
    }
};

function takeInputs(){
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

function rotateRacer(angle) {
    ctx.translate(racer.pos.x, racer.pos.y);
    ctx.scale(1, 0.5);
    ctx.rotate(angle);
    ctx.translate(-racer.pos.x, -racer.pos.y);
}