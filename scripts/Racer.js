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
            decelerationSpeed: 0.025,
            turnSpeed: 0.01,
            breakStrength: 25,
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
                acc.setMagnitude(this.stats.decelerationSpeed * this.stats.breakStrength);
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
            //console.log(this.vel.getMagnitude());
            if(this.vel.getMagnitude().toFixed(1) != 0) {
                //rotate sprite
                let modifier = this.inputs.turning;
                this.dir.setDirection(this.dir.getDirection() + this.stats.turnSpeed*modifier);
                
                //if "w" create two temporary vectors with modified vectors
                
                    let velocityVector = this.vel.copy();
                    velocityVector.multiplyBy(0.97);
                    let directionVector = this.vel.copy();
                    directionVector.multiplyBy(0.03);
                    directionVector.setAngle(this.dir.getAngle());

                    //this.vel.setAngle(velocityVector.angleBetween(directionVector));
                    this.vel.x = velocityVector.x + directionVector.x;
                    this.vel.y = velocityVector.y + directionVector.y;
                    //console.log(velocityVector.dot(directionVector));
                    //console.log(this.vel.getMagnitude());
                
            }
        }else {
            let angleDifference = this.dir.getDirection() - this.vel.getDirection();
            //console.log(angleDifference)
        }
        
        this.pos.addTo(this.vel);
    }
}