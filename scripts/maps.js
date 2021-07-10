class Map {
    constructor(args){
        this.name = args.name;
        this.width = args.width;
        this.height = args.height;
        this.image = args.image;
        this.dataImage = args.dataImage;
        this.drawScale = args.drawScale;
        this.dataScale = args.dataScale;
        this.backgroundImage = args.backgroundImage;
    }
}

var MAPS = {
    beginner: new Map({name: "beginner", width: 3200, height: 1800, image: "beginnermap", dataImage: "beginnermapDATA", drawScale: 0.5, dataScale: 1/8, backgroundImage: "grassSheet"})    
};


var RACER_SIZE = [256,256];
var RACER_DRAW_SIZE = [60,60];
var RACER_STACK_HEIGHT = 0.65;
var RACER_ROTATION_OFFSET = 30;
var BACKGROUND_SHEET_SIZE = 160;

var SETTINGS = {
    "BINDS": {
        "Drive_forwards": "w",
        "Drive_backwards": "s",
        "Turn_left": "a",
        "Turn_right": "d",
    },
    "CAMERA": {
        "max_distance_forwards": 100,
        "stiffness": 30,
    }
}
