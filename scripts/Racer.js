class Racer {
    constructor(args) {
        this.pos = new Vector(0,0);
        this.dir = new Vector(1,0);
        this.vel = new Vector(0,0);
        
        this.turnAngle = 0;
        
        this.inputs = {
            turning: 0,
            accelerating: 0,
        }
        
        this.stats = {
            topSpeed: 70,
            accelerationSpeed: 0.035,
            deccelerationSpeed: 0.01,
            turnSpeed: 0.01,
        }
    }
    
    update() {
        if (this.inputs.accelerating == 1) {
            let acc = this.dir.copy();
            let speed = this.vel.getMagnitude();
            acc.setMagnitude((this.stats.accelerationSpeed - (speed/this.stats.topSpeed)).toFixed(6));
            this.vel.addTo(acc);
        }
        else {
            let dragForce = this.vel.copy();
            dragForce.multiplyBy(-0.005);
            
            this.vel.addTo(dragForce);
        }
        
        if (this.inputs.turning != 0) {
            let modifier = this.inputs.turning;
            this.dir.setDirection(this.dir.getDirection() + this.stats.turnSpeed*modifier);
        }
        else {
            let angleDifference = this.dir.getDirection() - this.vel.getDirection();
            console.log(angleDifference)
        }
        
        this.pos.addTo(this.vel);
    }
}