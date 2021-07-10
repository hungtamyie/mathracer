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
        if (racer.inputs.turning != 0) {
            //console.log(this.vel.getMagnitude());
            if(racer.vel.getMagnitude().toFixed(2) < 1) {
                let modifier = racer.inputs.turning * racer.vel.getMagnitude()/2;
                racer.dir.setDirection(racer.dir.getDirection() + racer.stats.turnSpeed*modifier);
            }
            else {
                let modifier = racer.inputs.turning;
                racer.dir.setDirection(racer.dir.getDirection() + racer.stats.turnSpeed*modifier);
            }
        }else {
            let angleDifference = racer.dir.getDirection() - racer.vel.getDirection();
            //console.log(angleDifference)
        }
        
        let velocityVector = racer.vel.copy();
        velocityVector.multiplyBy(0.5);
        let directionVector = racer.vel.copy();
        directionVector.multiplyBy(0.5);
        directionVector.setAngle(racer.dir.getAngle());

        racer.vel.x = velocityVector.x + directionVector.x;
        racer.vel.y = velocityVector.y + directionVector.y;
        
        racer.pos.addTo(racer.vel);
    }
}