class Racer {
    constructor(x, y, dx, dy) {
        this.pos = new Vector(x,y);
        this.dir = new Vector(dx,dy);
        this.vel = new Vector(0,0);
        
        this.turnAngle = 0;
        
        this.inputs = {
            turning: 0,
            accelerating: 0,
        }
        
        this.stats = {
            topSpeed: 4,
            accelerationSpeeds: [
                [1.5, 0.004],
                [2, 0.002],
            ],
            radius: 10,
            dragMultiplier: -0.0025,
            decelerationSpeed: 0.025,
            turnSpeedLoss: 0.98,
            turnSpeed: 0.013,
            turnDriftMultiplier: 2,
            breakStrength: 25,
            //How much the car drifts at low speeds
            baseDriftConstant: 0.92,
            //How much the drift is increased by speed
            driftIncreaseMultiplier: 0.024,
            //How high the drift constant can get
            maxDriftConstant: 0.998,
            //The maximum distance that a racer can turn off it's velocity line
            maxTurnOffset: 1.2,
            //The speed at which a racer realigns its angle
            realignSpeed: 0.005,
            //Penalty for being on grass
            grassDriftPentalty: 0.001,
            grassBasePenalty: 0.04,
            grassDriftIncreaseMultiplierPenalty: 0.001,
            grassDragPenalty: -0.005,
            grassAccPenality: 0.95,
            //Penalty for being on dirt
            dirtDriftPentalty: 0.0016,
            dirtBasePenalty: 0.05,
            dirtDriftIncreaseMultiplierPenalty: 0.002,
            dirtDragPenalty: -0.001,
            dirtAccPenality: 0.2,
        }
    }
    
    getY(){
        return this.pos.y;
    }
}