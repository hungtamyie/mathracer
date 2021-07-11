class Game {
    //Takes args (map, racers)
    constructor(args) {
        this.mapName = args.map;
        this.racers = args.racers;
    }
    
    updateState(delta){
        for (const property in this.racers) {
            let racer = this.racers[property];
            this.updateRacer(racer, delta)
        }
    }
    
    updateRacer(racer, delta){

        if (racer.inputs.accelerating == 1) {
            let acc = racer.dir.copy();
            let speed = racer.vel.getMagnitude();
            
            //will this ever be < 0 ? 
            acc.setMagnitude((racer.stats.accelerationSpeed - (speed/racer.stats.topSpeed)).toFixed(6));
            
            racer.vel.addTo(acc);
            
        }else if(racer.inputs.accelerating == -1) {
            racer.vel.setMagnitude(racer.vel.getMagnitude()-0.03);
            
        }else {
            let dragForce = racer.vel.copy();
            dragForce.multiplyBy(-0.0075);
            
            racer.vel.addTo(dragForce);
        }
        
        //turning
        let slowSpeed = false; //used to preserve tight radius
        if (racer.inputs.turning != 0) {
            //console.log(this.vel.getMagnitude());
            if(racer.vel.getMagnitude().toFixed(2) < 1) { //slow speed turning
                slowSpeed = true;
                let modifier = racer.inputs.turning * racer.vel.getMagnitude()/2;
                racer.dir.setDirection(racer.dir.getDirection() + racer.stats.turnSpeed*modifier);
            } 
            else {
                let modifier = racer.inputs.turning;
                racer.dir.setDirection(racer.dir.getDirection() + racer.stats.turnSpeed*modifier);
            }
        }else { //re-align dir and vel
            let angleDifference = racer.dir.angleBetween(racer.vel);
            //console.log(angleDifference)
        }
        
        if(racer.inputs.accelerating == 1) {
            racer.stats.driftConst += 0.0002;
            if(racer.stats.driftConst > 0.485) {
                racer.stats.driftConst = 0.485;
            }
        }else if(racer.inputs.accelerating == 0) {
            racer.stats.driftConst -= 0.0002;
            if(racer.stats.driftConst < 0.46) {
                racer.stats.driftConst = 0.46;
            }
        } 
        let velocityVector = racer.vel.copy();
        let directionVector = racer.vel.copy();
        directionVector.setAngle(racer.dir.getAngle());
        velocityVector.multiplyBy(0.5 + racer.stats.driftConst);
        directionVector.multiplyBy(0.5 - racer.stats.driftConst);
        console.log(racer.stats.driftConst);
        

        racer.vel.x = velocityVector.x + directionVector.x;
        racer.vel.y = velocityVector.y + directionVector.y;
        
        racer.pos.addTo(racer.vel);
    }
}