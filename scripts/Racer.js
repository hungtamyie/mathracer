class Racer {
    constructor(args) {
        this.pos = new Vector(-300,600);
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
            decelerationSpeed: 0.025,
            turnSpeed: 0.01,
        }
    }
    
    update(delta) {
        //acceleration
        if (this.inputs.accelerating == 1) {
            let acc = this.dir.copy();
            let speed = this.vel.getMagnitude();
            
            //will this ever be < 0 ? 
            acc.setMagnitude((this.stats.accelerationSpeed - (speed/this.stats.topSpeed)).toFixed(6));
            
            this.vel.addTo(acc);
            
        }else if(this.inputs.accelerating == -1) {
            let acc = this.dir.copy();
            let speed = this.vel.getMagnitude();
            
            if((this.stats.decelerationSpeed < (speed/this.stats.topSpeed).toFixed(6))) {
                acc.setMagnitude(this.stats.decelerationSpeed * 25);
                this.vel.subtractFrom(acc);
            }else {
                acc.setMagnitude(this.stats.decelerationSpeed - (speed / this.stats.topSpeed).toFixed(6));
                this.vel.subtractFrom(acc);  
            }
            
        }else {
            let dragForce = this.vel.copy();
            dragForce.multiplyBy(-0.0075);
            
            this.vel.addTo(dragForce);
        }
        
        //turning
        if (this.inputs.turning != 0) {
            let modifier = this.inputs.turning;
            this.dir.setDirection(this.dir.getDirection() + this.stats.turnSpeed*modifier);
        }
        else {
            let angleDifference = this.dir.getDirection() - this.vel.getDirection();
            //console.log(angleDifference)
        }
        
        this.pos.addTo(this.vel);
    }
}