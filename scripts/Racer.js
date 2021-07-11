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
            turnSpeed: 0.015,
            driftConst: 0.46,
            breakStrength: 25,
        }
    }
}