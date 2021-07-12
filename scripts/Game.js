class Game {
    //Takes args (map, racers)
    constructor(args) {
        this.mapName = args.mapName;
        this.racers = args.racers;
        this.mapEntities = [];
        this.dataMap = {
            canvas: undefined,
            ctx: undefined,
        }
        this.particles = [];
        
        //add stuff to game
        let map = MAPS[this.mapName];
        for (let i = 0; i < map.entities.length; i++) {
            if (map.entities[i][0] == "blackTire") {
                let obj = new TireBlack(map.entities[i][1], map.entities[i][2])
                this.mapEntities.push(obj);
            }
            if (map.entities[i][0] == "redWhiteTire") {
                let obj = new TireWhiteRed(map.entities[i][1], map.entities[i][2])
                this.mapEntities.push(obj);
            }
            if (map.entities[i][0] == "whiteRedTire") {
                let obj = new TireRedWhite(map.entities[i][1], map.entities[i][2])
                this.mapEntities.push(obj);
            }
            if (map.entities[i][0] == "barrierLeft") {
                let obj = new BarrierLeft(map.entities[i][1], map.entities[i][2])
                this.mapEntities.push(obj);
            }
            if (map.entities[i][0] == "barrierRight") {
                let obj = new BarrierRight(map.entities[i][1], map.entities[i][2])
                this.mapEntities.push(obj);
            }
        }
        //Create dataMap element
        this.dataMap.canvas = document.createElement("canvas");
        this.dataMap.canvas.width = map.width*map.dataScale;
        this.dataMap.canvas.height = map.height*map.dataScale;
        this.dataMap.ctx = this.dataMap.canvas.getContext("2d");
        this.dataMap.ctx.drawImage(images[map.dataImage], 0, 0);
        //document.getElementById("debug").appendChild(this.dataMap.canvas);
    }
    
    updateState(delta){
        for (const property in this.racers) {
            let racer = this.racers[property];
            this.updateRacer(racer, delta);
            this.createRacerParticles(racer, delta);
            this.collideRacer(racer, delta);
        }
        this.updateObstacles(delta);
        this.updateParticles(delta);
    }
    
    updateRacer(racer, delta){
        let terrain = this.getTerrainAt(racer.pos.x, racer.pos.y);
        let velocityDirection = (racer.vel.dot(racer.dir)) / (racer.dir.getMagnitude() ** 2)||1;
        if (racer.inputs.accelerating == 1) {
            
            //Sets the acceleration based on the racer's speed
            let acc = racer.dir.copy();
            let speed = racer.vel.getMagnitude();
            acc.setMagnitude(racer.stats.accelerationSpeeds[racer.stats.accelerationSpeeds.length-1][1]);
            for (let i = 0; i < racer.stats.accelerationSpeeds.length; i++) {
                let speedRange = racer.stats.accelerationSpeeds[i][0];
                let accelerationValue = racer.stats.accelerationSpeeds[i][1];
                if (speed < speedRange) {
                    acc.setMagnitude(accelerationValue);
                    break;
                }
            }
            if (speed < racer.stats.topSpeed) {
                acc.multiplyBy(delta);
                if (terrain == "dirt") {
                    acc.multiplyBy(racer.stats.dirtAccPenality)
                }
                else if (terrain == "grass") {
                    acc.multiplyBy(racer.stats.grassAccPenality)
                }
                racer.vel.addTo(acc);
            }
            
        }else if(racer.inputs.accelerating == -1) {
            if (velocityDirection > 0) {
                racer.vel.setMagnitude(racer.vel.getMagnitude()-0.01*delta);
            }
            else {
                let acc = racer.dir.copy();
                acc.multiplyBy(-0.005*delta);
                racer.vel.addTo(acc);
            }
            
        }else {
            let dragForce = racer.vel.copy();
            dragForce.multiplyBy(racer.stats.dragMultiplier*delta);
            racer.vel.addTo(dragForce);
            
            if (racer.vel.getMagnitude() < 0.05) {
                racer.vel.setMagnitude(0);
            }
        }
        
        //turning
        if (racer.inputs.turning != 0) {
            //console.log(this.vel.getMagnitude());
            let modifier = racer.inputs.turning;
            if(racer.vel.getMagnitude().toFixed(2) < 1) { //slow speed turning
                modifier = modifier * racer.vel.getMagnitude();
            }
            if (velocityDirection < 0) {
                modifier = modifier * -1;
            }
            racer.dir.setDirection(racer.dir.getDirection() + racer.stats.turnSpeed*modifier*delta);
        }
        else if (Math.abs(racer.vel.getMagnitude()) > 0) { //re-align dir and vel
            let angleDifference = racer.vel.angleBetween(racer.dir);
            let sign = Math.abs(angleDifference)/angleDifference||1;
            if (angleDifference < Math.PI/2 && velocityDirection > 0) {
                racer.dir.setDirection(racer.dir.getDirection() + sign * racer.stats.realignSpeed*delta);
            }
        }
        let velocityVector = racer.vel.copy();
        let directionVector = racer.vel.copy();
        directionVector.setAngle(racer.dir.getAngle());
        if (velocityDirection < 0) {
            directionVector.multiplyBy(-1);
        }
        
        let penaltyDriftIncrease = 0;
        let penaltyMaxDrift = 0;
        let penaltyBase  = 0;
        if (terrain == "grass") {
            penaltyDriftIncrease = racer.stats.grassDriftIncreaseMultiplierPenalty;
            penaltyMaxDrift = racer.stats.grassDriftPentalty;
            penaltyBase = racer.stats.grassBasePenalty;
        }
        if (terrain == "dirt") {
            penaltyDriftIncrease = racer.stats.dirtDriftIncreaseMultiplierPenalty;
            penaltyMaxDrift = racer.stats.dirtDriftPentalty;
            penaltyBase = racer.stats.dirtBasePenalty;
        }
        let driftIncrease = racer.vel.getMagnitude() * (racer.stats.driftIncreaseMultiplier + penaltyDriftIncrease);
        let driftAmount = (racer.stats.baseDriftConstant + penaltyBase) + driftIncrease;
        if (driftAmount > racer.stats.maxDriftConstant + penaltyMaxDrift) {
            driftAmount = racer.stats.maxDriftConstant + penaltyMaxDrift;
        }
        velocityVector.multiplyBy(driftAmount);
        directionVector.multiplyBy(1 - driftAmount);
        
        racer.vel.x = velocityVector.x + directionVector.x;
        racer.vel.y = velocityVector.y + directionVector.y;
        
        //Slow car down if touching grass or dirt. 
        if (terrain == "grass"){
            let dragForce = racer.vel.copy();
            dragForce.multiplyBy(racer.stats.grassDragPenalty*delta);
            racer.vel.addTo(dragForce);
        }
        else if (terrain == "dirt"){
            let dragForce = racer.vel.copy();
            dragForce.multiplyBy(racer.stats.dirtDragPenalty*delta);
            racer.vel.addTo(dragForce);
        }
        racer.pos.addTo(racer.vel.multiply(delta));
    }
    createRacerParticles(racer, delta){
        let terrain = this.getTerrainAt(racer.pos.x, racer.pos.y);
        if (terrain == "road") {
            let velocityDirection = (racer.vel.dot(racer.dir)) / (racer.dir.getMagnitude() ** 2)||1;
            let dir = racer.dir.copy();
            if (velocityDirection < 0) {
                dir.multiplyBy(-1);
            }
            if (Math.abs(racer.vel.angleBetween(dir)) > 0.3 && racer.vel.getMagnitude() > 0) {
                for (let i = 0; i < 5*delta; i++) {
                    if (Math.random() > 1 - (Math.abs(racer.vel.getDirection() - racer.dir.getDirection())/30) - (racer.vel.getMagnitude()/1000)) {
                        this.particles.push(new Particle(
                            racer.pos.x,
                            racer.pos.y,
                            racer.vel.x*1.2 + getRandomInt(-6, 6)/10,
                            racer.vel.y*1.2 + getRandomInt(-6, 6)/10,
                            getRandomInt(80,140),
                            0,
                            0,
                            6,
                            40,
                        ))
                    }
                }
            }
        }
        else if (terrain == "grass") {
            for (let i = 0; i < 5*delta; i++) {
                if (Math.random() > 1 - (racer.vel.getMagnitude()/80)) {
                    this.particles.push(new Particle(
                        racer.pos.x,
                        racer.pos.y,
                        racer.vel.x*-0.1 + getRandomInt(-6, 6)/10,
                        racer.vel.y*-0.1 + getRandomInt(-6, 6)/10,
                        getRandomInt(80,140),
                        0,
                        3,
                        4,
                        30,
                    ))
                    if (racer.inputs.accelerating != 0) {
                        this.particles.push(new Particle(
                            racer.pos.x + racer.dir.x * -15,
                            racer.pos.y + racer.dir.y * -15,
                            racer.vel.x*-0.3 + getRandomInt(-10, 10)/10,
                            racer.vel.y*-0.3 + getRandomInt(-10, 10)/10,
                            getRandomInt(100,200),
                            0,
                            1,
                            4,
                            30,
                        ))
                    }
                }
            }
        }
        else if (terrain == "dirt") {
            for (let i = 0; i < 5*delta; i++) {
                if (Math.random() > 1 - (racer.vel.getMagnitude()/80)) {
                    this.particles.push(new Particle(
                        racer.pos.x,
                        racer.pos.y,
                        racer.vel.x + getRandomInt(-12, 12)/15,
                        racer.vel.y + getRandomInt(-12, 12)/15,
                        getRandomInt(300,540),
                        0,
                        2,
                        4,
                        90,
                    ))
                    if (racer.inputs.accelerating != 0) {
                        this.particles.push(new Particle(
                            racer.pos.x + racer.dir.x * -15,
                            racer.pos.y + racer.dir.y * -15,
                            racer.vel.x*-0.3 + getRandomInt(-10, 10)/10,
                            racer.vel.y*-0.3 + getRandomInt(-10, 10)/10,
                            getRandomInt(100,200),
                            0,
                            1,
                            4,
                            30,
                        ))
                    }
                }
            }
        } {
            
        }
    }
    
    updateObstacles(delta){
        for (let i = 0; i < this.mapEntities.length; i++) {
            let obstacle = this.mapEntities[i];
            obstacle.updateShake(delta);
        }
    }
    updateParticles(delta){
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update(delta);
            if (particle.life > particle.lifetime) { 
                this.particles.splice(i, 1);
            }
        }
    }
    
    
    collideRacer(racer, delta){
        for (let i = 0; i < this.mapEntities.length; i++) {
            let obstacle = this.mapEntities[i];
            let distance = Math.sqrt(Math.pow(obstacle.x - racer.pos.x, 2) + Math.pow(obstacle.y - racer.pos.y, 2));
            if (distance < obstacle.radius + racer.stats.radius) {
                console.log("bang");
                let vectorBetween = new Vector(obstacle.x - racer.pos.x, obstacle.y - racer.pos.y);
                vectorBetween.setMagnitude(obstacle.radius + racer.stats.radius + 0.1);
                racer.pos.x = obstacle.x - vectorBetween.x;
                racer.pos.y = obstacle.y - vectorBetween.y;
                
                let collisionNormal = new Vector(obstacle.x - racer.pos.x, obstacle.y - racer.pos.y);
                collisionNormal.normalize();
                let collisionProjection = collisionNormal.multiply(((racer.vel.dot(collisionNormal)) / (collisionNormal.getMagnitude() ** 2)).toFixed(5)*1||1);
                obstacle.startShake(collisionProjection.getMagnitude());
                collisionProjection.multiplyBy(-obstacle.bounce)
                racer.vel.addTo(collisionProjection);
            }
        }

    }
    
    getTerrainAt(x, y){
        let map = MAPS[this.mapName];
        let color = this.dataMap.ctx.getImageData(x*map.dataScale, y*map.dataScale/2, 1, 1).data;
        this.dataMap.ctx.fillStyle = "red";
        //this.dataMap.ctx.fillRect(x*map.dataScale, y*map.dataScale/2, 1, 1)
        if (color[3] == 255) {
            if (color[1] == 255) {
                return "dirt";
            }
            else {
                return "road";
            }
        }
        else {
            return "grass";
        }
    }
}